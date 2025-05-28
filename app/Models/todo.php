<?php

namespace App\Models;

use App\Core\Database;
use PDO;

class Todo {
    private PDO $db;

    public function __construct() {
        $this->db = Database::connection();
    }

    // filtreleme ve listeleme (page - limit - sort - order - status - title - priority - date <> range)
    public function filtered($params) {
        $sql = "SELECT t.*, GROUP_CONCAT(c.name) AS categories FROM todos t ";
        $sql .= "LEFT JOIN todo_category tc ON t.id = tc.todo_id ";
        $sql .= "LEFT JOIN categories c ON tc.category_id = c.id ";
        $sql .= "WHERE t.deleted_at IS NULL";

        $conditions = [];
        $values = [];

        if (!empty($params['status'])) {
            $conditions[] = "t.status = ?";
            $values[] = $params['status'];
        }

        if (!empty($params['priority'])) {
            $conditions[] = "t.priority = ?";
            $values[] = $params['priority'];
        }

        if (!empty($params['title'])) {
            $conditions[] = "t.title LIKE ?";
            $values[] = '%' . $params['title'] . '%';
        }

        if (!empty($params['description'])) {
            $conditions[] = "t.description LIKE ?";
            $values[] = '%' . $params['description'] . '%';
        }

        if (!empty($params['from_date'])) {
            $conditions[] = "t.due_date >= ?";
            $values[] = $params['from_date'];
        }

        if (!empty($params['to_date'])) {
            $conditions[] = "t.due_date <= ?";
            $values[] = $params['to_date'];
        }

        if (!empty($params['category_id'])) {
            $conditions[] = "EXISTS (
                SELECT 1 FROM todo_category tc 
                WHERE tc.todo_id = t.id AND tc.category_id = ?
            )";
            $values[] = $params['category_id'];
        }        

        if ($conditions) {
            $sql .= " AND " . implode(" AND ", $conditions);
        }

        $sql .= " GROUP BY t.id";

        $allowedSort = ['due_date', 'created_at', 'priority', 'title'];
        $sort = in_array($params['sort'] ?? '', $allowedSort) ? $params['sort'] : 'created_at';
        $order = ($params['order'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

        $page = max((int)($params['page'] ?? 1), 1);
        $limit = min(max((int)($params['limit'] ?? 10), 1), 100);
        $offset = ($page - 1) * $limit;

        $sql .= " ORDER BY t." . $sort . " " . $order . " LIMIT $limit OFFSET $offset";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($values);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countFiltered($params): int {
    $sql = "SELECT COUNT(DISTINCT t.id) as total FROM todos t ";
    $sql .= "LEFT JOIN todo_category tc ON t.id = tc.todo_id ";
    $sql .= "LEFT JOIN categories c ON tc.category_id = c.id ";
    $sql .= "WHERE t.deleted_at IS NULL";

    $conditions = [];
    $values = [];

    if (!empty($params['status'])) {
        $conditions[] = "t.status = ?";
        $values[] = $params['status'];
    }

    if (!empty($params['priority'])) {
        $conditions[] = "t.priority = ?";
        $values[] = $params['priority'];
    }

    if (!empty($params['title'])) {
        $conditions[] = "t.title LIKE ?";
        $values[] = '%' . $params['title'] . '%';
    }

    if (!empty($params['description'])) {
        $conditions[] = "t.description LIKE ?";
        $values[] = '%' . $params['description'] . '%';
    }

    if (!empty($params['from_date'])) {
        $conditions[] = "t.due_date >= ?";
        $values[] = $params['from_date'];
    }

    if (!empty($params['to_date'])) {
        $conditions[] = "t.due_date <= ?";
        $values[] = $params['to_date'];
    }

    if (!empty($params['category_id'])) {
        $conditions[] = "EXISTS (
            SELECT 1 FROM todo_category tc 
            WHERE tc.todo_id = t.id AND tc.category_id = ?
        )";
        $values[] = $params['category_id'];
    }

    if ($conditions) {
        $sql .= " AND " . implode(" AND ", $conditions);
    }

    $stmt = $this->db->prepare($sql);
    $stmt->execute($values);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return (int)$result['total'];
}


    public function find($id) {
        $stmt = $this->db->prepare("SELECT * FROM todos WHERE id = ? AND deleted_at IS NULL");
        $stmt->execute([$id]);
        $todo = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($todo) {
            $stmt = $this->db->prepare("SELECT c.id, c.name, c.color FROM categories c
                INNER JOIN todo_category tc ON c.id = tc.category_id
                WHERE tc.todo_id = ?");
            $stmt->execute([$id]);
            $todo['categories'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return $todo;
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO todos (title, description, status, priority, due_date)
            VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['description'] ?? null,
            $data['status'] ?? 'pending',
            $data['priority'] ?? 'medium',
            $data['due_date'] ?? null
        ]);

        $todoId = $this->db->lastInsertId();
        $this->syncCategories($todoId, $data['category_ids'] ?? []);

        return $this->find($todoId);
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE todos SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = NOW() 
            WHERE id = ? AND deleted_at IS NULL");
        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['status'],
            $data['priority'],
            $data['due_date'],
            $id
        ]);

        $this->syncCategories($id, $data['category_ids'] ?? []);

        return $this->find($id);
    }

    public function updateStatus($id, $status) {
        $stmt = $this->db->prepare("UPDATE todos SET status = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL");
        $stmt->execute([$status, $id]);
        return $this->find($id);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("UPDATE todos SET deleted_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);

        $stmt = $this->db->prepare("DELETE FROM todo_category WHERE todo_id = ?");
        $stmt->execute([$id]);

        return true;
    }

    private function syncCategories($todoId, $categoryIds) {
        $stmt = $this->db->prepare("DELETE FROM todo_category WHERE todo_id = ?");
        $stmt->execute([$todoId]);

        if (!empty($categoryIds)) {
            $stmt = $this->db->prepare("INSERT INTO todo_category (todo_id, category_id) VALUES (?, ?)");
            foreach ($categoryIds as $categoryId) {
                $stmt->execute([$todoId, $categoryId]);
            }
        }
    }
}
