<?php

namespace App\Controllers;

use App\Core\Database;
use App\Helpers\JwtHelper;

class AuthController {
    public function login() {
        header('Content-Type: application/json');
        $ip = $_SERVER['REMOTE_ADDR'];

        // json input
        $input = json_decode(file_get_contents("php://input"), true);

        // captcha kontrol
        if (empty($input['email']) || empty($input['password']) || empty($input['captchaToken'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email, password ve captchaToken gereklidir.']);
            return;
        }

// hcaptcha doğrulama
$captchaSecret = '0x0000000000000000000000000000000000000000';
$captchaResponse = file_get_contents("https://hcaptcha.com/siteverify", false, stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'secret'   => $captchaSecret,
            'response' => $input['captchaToken'],
            'remoteip' => $ip
        ])
    ]
]));

        $captchaData = json_decode($captchaResponse, true);
        if (!isset($captchaData['success']) || !$captchaData['success']) {
            http_response_code(403);
            echo json_encode(['error' => 'Captcha doğrulaması başarısız.']);
            return;
        }

        $db = Database::connection();

        // ip basina basarisiz giris, kullanici banlandi
        $stmt = $db->prepare("SELECT attempt_count FROM ip_failures WHERE ip_address = ? AND email = ?");
        $stmt->execute([$ip, $input['email']]);
        $failure = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($failure && $failure['attempt_count'] >= 5) {
            http_response_code(429);
            echo json_encode(['error' => 'Bu IP bu hesap için engellenmiştir.']);
            return;
        }

        // kullanıcı var mı
        $stmt = $db->prepare("SELECT * FROM admins WHERE email = ?");
        $stmt->execute([$input['email']]);
        $admin = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$admin) {
            http_response_code(401);
            echo json_encode(['error' => 'Geçersiz kullanıcı veya şifre.']);
            return;
        }

        // şifre dogrumu
        if (password_verify($input['password'], $admin['password'])) {
            // başarılı giris - basarisiz iplar silinir
            $stmt = $db->prepare("DELETE FROM ip_failures WHERE ip_address = ? AND email = ?");
            $stmt->execute([$ip, $input['email']]);

            // ip güncelle
            if ($admin['ip_address'] !== $ip) {
                $stmt = $db->prepare("UPDATE admins SET ip_address = ? WHERE id = ?");
                $stmt->execute([$ip, $admin['id']]);
            }

            // JWT oluştur
            $jwtLifetime = getenv('JWT_LIFETIME') ?: 3600;
            $token = JwtHelper::encode([
                'admin_id' => $admin['id'],
                'email'    => $admin['email']
            ], (int)$jwtLifetime);

            echo json_encode([
                'token' => $token,
                'ip'    => $ip
            ]);
        } else {
            // Hatalı şifre giriş deeneme sayısı
            if ($failure) {
                $stmt = $db->prepare("UPDATE ip_failures SET attempt_count = attempt_count + 1, last_attempt_at = NOW() WHERE ip_address = ? AND email = ?");
                $stmt->execute([$ip, $input['email']]);
            } else {
                $stmt = $db->prepare("INSERT INTO ip_failures (ip_address, email, attempt_count) VALUES (?, ?, 1)");
                $stmt->execute([$ip, $input['email']]);
            }

            http_response_code(401);
            echo json_encode(['error' => 'Geçersiz kullanıcı veya şifre.']);
        }
    }
}