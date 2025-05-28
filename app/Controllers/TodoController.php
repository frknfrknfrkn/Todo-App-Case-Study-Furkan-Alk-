<?php

namespace App\Controllers;

use App\Models\Todo;
use App\Models\TodoCategory;

class TodoController {
    private Todo $todo;
    private TodoCategory $todoCategory;

    public function __construct() {
        $this->todo = new Todo();
        $this->todoCategory = new TodoCategory();
        header('Content-Type: application/json');
    }

public function index() {
    $params = $_GET;

    $page = max((int)($params['page'] ?? 1), 1);
    $limit = min(max((int)($params['limit'] ?? 10), 1), 100);
    $offset = ($page - 1) * $limit;

    $total = $this->todo->countFiltered($params);
    $totalPages = ceil($total / $limit);

    $data = $this->todo->filtered($params); // zaten limit/offset dahil

    if (!is_array($data)) {
        $data = [];
    }

    foreach ($data as &$todo) {
        $todo['categories'] = $this->todoCategory->getCategoriesByTodoId($todo['id']);
    }

    echo json_encode([
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'total_pages' => $totalPages,
        'data' => $data
    ]);
}

    public function show($id) {
        $todo = $this->todo->find($id);
        if ($todo) {
            $todo['categories'] = $this->todoCategory->getCategoriesByTodoId($id);
            echo json_encode($todo);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Todo not found']);
        }
    }

    public function store() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
    
            $created = $this->todo->create($data);
            if (isset($data['category_ids']) && is_array($data['category_ids'])) {
                $this->todoCategory->attachCategories($created['id'], $data['category_ids']);
                $created['categories'] = $this->todoCategory->getCategoriesByTodoId($created['id']);
            }
    
            echo json_encode($created);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Sunucu hatası', 'debug' => $e->getMessage()]);
        }
    }    

    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);

        $updated = $this->todo->update($id, $data);

        if (isset($data['category_ids']) && is_array($data['category_ids'])) {
            $this->todoCategory->detachCategories($id);
            $this->todoCategory->attachCategories($id, $data['category_ids']);
            $updated['categories'] = $this->todoCategory->getCategoriesByTodoId($id);
        }

        echo json_encode($updated);
    }

    public function updateStatus($id) {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing status field']);
            return;
        }

        $updated = $this->todo->updateStatus($id, $data['status']);
        echo json_encode($updated);
    }

    public function delete($id) {
        $this->todoCategory->detachCategories($id); // Baglantilii kategoriyi sill
        $this->todo->delete($id);
        echo json_encode(['message' => 'Todo deleted']);
    }
}
