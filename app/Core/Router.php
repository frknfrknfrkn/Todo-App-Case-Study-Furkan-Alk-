<?php

namespace App\Core;

class Router {
    private array $routes = [];

    public function get(string $path, callable|array $callback) {
        $this->addRoute('GET', $path, $callback);
    }

    public function post(string $path, callable|array $callback) {
        $this->addRoute('POST', $path, $callback);
    }

    public function put(string $path, callable|array $callback) {
        $this->addRoute('PUT', $path, $callback);
    }

    public function patch(string $path, callable|array $callback) {
        $this->addRoute('PATCH', $path, $callback);
    }

    public function delete(string $path, callable|array $callback) {
        $this->addRoute('DELETE', $path, $callback);
    }

    private function addRoute(string $method, string $path, callable|array $callback) {
        $this->routes[$method][$path] = $callback;
    }

    public function dispatch($method, $uri) {
        $uri = parse_url($uri, PHP_URL_PATH);
    
        $scriptName = dirname($_SERVER['SCRIPT_NAME']);
        if (strpos($uri, $scriptName) === 0) {
            $uri = substr($uri, strlen($scriptName));
        }
    
        $uri = rtrim($uri, '/');
        $routes = $this->routes[$method] ?? [];
    
        foreach ($routes as $path => $callback) {
            $pattern = preg_replace('#\{([\w]+)\}#', '([\w-]+)', $path);
            $pattern = "#^" . rtrim($pattern, '/') . "$#";
    
            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                if (is_array($callback)) {
                    [$class, $methodName] = $callback;
                    $controller = new $class;
                    return call_user_func_array([$controller, $methodName], $matches);
                }
                return call_user_func_array($callback, $matches);
            }
        }
    
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
    }    
}