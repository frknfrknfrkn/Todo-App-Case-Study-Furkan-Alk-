<?php

namespace App\Helpers;

class JwtHelper {
    private static ?string $secret = null;

    private static function init(): void {
        self::$secret = getenv('JWT_SECRET') ?: 'kkk2992222SDx';
    }

    public static function encode(array $payload, int $lifetimeSeconds = null): string {
        if (!self::$secret) self::init();

        $expTime = $lifetimeSeconds ?? (int)getenv('JWT_LIFETIME') ?: 36000;
        $payload['exp'] = time() + $expTime;

        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload = json_encode($payload);

        $base64UrlHeader = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
        $base64UrlPayload = rtrim(strtr(base64_encode($payload), '+/', '-_'), '=');
        $signature = hash_hmac('sha256', "$base64UrlHeader.$base64UrlPayload", self::$secret, true);
        $base64UrlSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

        return "$base64UrlHeader.$base64UrlPayload.$base64UrlSignature";
    }

    public static function decode(string $token): ?array {
        if (!self::$secret) self::init();
    
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
    
        [$header, $payload, $signature] = $parts;
    
        $expected = rtrim(strtr(base64_encode(
            hash_hmac('sha256', "$header.$payload", self::$secret, true)
        ), '+/', '-_'), '=');
    
        if (!hash_equals($expected, $signature)) return null;
    
        $json = base64_decode(strtr($payload, '-_', '+/'));
        $data = json_decode($json, true);
    
        if (!is_array($data)) return null;
    
        if (isset($data['exp']) && time() >= (int)$data['exp']) {
            return null;
        }        
    
        return $data;
    }    
}