<?php

namespace App\Models;

use App\Core\Database;
use PDO;

class TodoCategory
{
    protected PDO $db;

    public function __construct()
    {
        $this->db = Database::connection();
    }

    // Belirli bir todo'nun kategorilerini getir
    public function getCategoriesByTodoId($todoId)
    {
        $stmt = $this->db->prepare("
            SELECT c.id, c.name, c.color 
            FROM categories c
            INNER JOIN todo_category tc ON c.id = tc.category_id
            WHERE tc.todo_id = ?
        ");
        $stmt->execute([$todoId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Belirli bir todo'ya kategori bağla
    public function attachCategories($todoId, array $categoryIds)
    {
        $stmt = $this->db->prepare("INSERT IGNORE INTO todo_category (todo_id, category_id) VALUES (?, ?)");
    
        foreach (array_unique($categoryIds) as $categoryId) {
            $stmt->execute([$todoId, $categoryId]);
        }
    }    

    // Belirli bir todo'dan tüm kategorileri kaldır
    public function detachCategories($todoId)
    {
        $stmt = $this->db->prepare("DELETE FROM todo_category WHERE todo_id = ?");
        $stmt->execute([$todoId]);
    }
}