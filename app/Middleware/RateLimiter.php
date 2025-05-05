<?php

namespace App\Middleware;

class RateLimiter {
    public static function limit(string $key, int $maxAttempts, int $windowSeconds): bool {
        $dir = __DIR__ . '/../../storage/ratelimit/';
        if (!is_dir($dir)) mkdir($dir, 0777, true);

        $file = $dir . md5($key);
        $now = time();

        $data = [
            'count' => 0,
            'start' => $now
        ];

        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true);
            if ($now - $data['start'] < $windowSeconds) {
                if ($data['count'] >= $maxAttempts) {
                    return false; // limit aşıldı
                }
                $data['count']++;
            } else {
                $data = ['count' => 1, 'start' => $now]; // pencere sıfırlandı
            }
        }

        file_put_contents($file, json_encode($data));
        return true;
    }
}