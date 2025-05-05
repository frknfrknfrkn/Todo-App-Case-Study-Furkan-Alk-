<?php

namespace App\Models;

use PDO;

class Category extends BaseModel
{
    protected $table = 'categories';

    public function all()
    {
        $stmt = $this->pdo->query("SELECT * FROM {$this->table} ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO {$this->table} (name, color) VALUES (:name, :color)");
        return $stmt->execute([
            'name' => $data['name'],
            'color' => $data['color'] ?? '#4B5563',
        ]);
    }

    public function find($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE {$this->table} SET name = :name, color = :color WHERE id = :id");
        return $stmt->execute([
            'name' => $data['name'],
            'color' => $data['color'] ?? '#4B5563',
            'id'   => $id
        ]);
    }
}