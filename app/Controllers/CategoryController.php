<?php

namespace App\Controllers;

use App\Core\Database;
use PDO;

class CategoryController
{
    protected $db;

    public function __construct()
    {
        $this->db = Database::connection();
        header('Content-Type: application/json');
    }

    // tüm kategoriler list
    public function index()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM categories ORDER BY id DESC");
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($categories);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Kategori listelenemedi.',
                'debug' => $e->getMessage()
            ]);
        }
    }

    // yeni kategori
    public function store()
    {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Geçersiz JSON gönderildi.']);
            return;
        }

        if (!isset($data['name']) || trim($data['name']) === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Kategori adı gerekli.']);
            return;
        }

        try {
            $name = htmlspecialchars(trim($data['name']));
            $color = $data['color'] ?? '#4B5563';

            $stmt = $this->db->prepare("INSERT INTO categories (name, color) VALUES (:name, :color)");
            $stmt->execute([
                'name' => $name,
                'color' => $color
            ]);

            http_response_code(201);
            echo json_encode(['message' => 'Kategori başarıyla eklendi.']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Veritabanı hatası.',
                'debug' => $e->getMessage()
            ]);
        }
    }

    // kategori sil
    public function delete($id)
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM categories WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Kategori silindi.']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Kategori bulunamadı.']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Silme işlemi başarısız.',
                'debug' => $e->getMessage()
            ]);
        }
    }

    // kategori güncelle
    public function update($id)
    {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (!isset($data['name']) || trim($data['name']) === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Kategori adı zorunludur.']);
            return;
        }

        try {
            $name = htmlspecialchars(trim($data['name']));
            $color = $data['color'] ?? '#4B5563';

            $stmt = $this->db->prepare("UPDATE categories SET name = :name, color = :color WHERE id = :id");
            $stmt->execute([
                'name' => $name,
                'color' => $color,
                'id' => $id
            ]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Kategori güncellendi.']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Kategori bulunamadı.']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Güncelleme hatası.',
                'debug' => $e->getMessage()
            ]);
        }
    }
}