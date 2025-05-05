<?php

namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Core\Database;

class AdminController {
    public function info() {
        header('Content-Type: application/json');

        $payload = AuthMiddleware::check();
        $adminId = $payload['admin_id'];

        $db = Database::connection();
        $stmt = $db->prepare("SELECT email, ip_address, created_at FROM admins WHERE id = ?");
        $stmt->execute([$adminId]);
        $adminInfo = $stmt->fetch(\PDO::FETCH_ASSOC);

        echo json_encode($adminInfo);
    }
}