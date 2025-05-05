<?php

namespace App\Middleware;

use App\Helpers\JwtHelper;

class AuthMiddleware {
    public static function check() {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Authorization header required']);
            exit;
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $decoded = JwtHelper::decode($token);

        if (!$decoded || !isset($decoded['admin_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }

        return $decoded;
    }

    public static function user() {
        $headers = getallheaders();
        $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
        $decoded = JwtHelper::decode($token);
        return $decoded;
    }
}