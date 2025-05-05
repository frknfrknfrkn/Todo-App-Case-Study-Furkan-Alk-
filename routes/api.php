<?php

use App\Controllers\AuthController;
use App\Controllers\TodoController;
use App\Controllers\CategoryController;
use App\Controllers\AdminController;
use App\Middleware\AuthMiddleware;

//  giris
$router->post('/api/login', [AuthController::class, 'login']);

// admin bilgiler
$router->get('/api/admin/info', function () {
    AuthMiddleware::check();
    (new AdminController)->info();
});

// category
$router->get('/api/categories', function () {
    AuthMiddleware::check();
    (new CategoryController)->index();
});

$router->post('/api/categories', function () {
    AuthMiddleware::check();
    (new CategoryController)->store();
});

$router->delete('/api/categories/{id}', function ($id) {
    AuthMiddleware::check();
    (new CategoryController)->delete($id);
});

$router->put('/api/categories/{id}', function ($id) {
    AuthMiddleware::check();
    (new CategoryController)->update($id);
});

// jwt korumalı
$router->get('/api/todos', function () {
    AuthMiddleware::check();
    (new TodoController)->index();
});

$router->post('/api/todos', function () {
    AuthMiddleware::check();
    (new TodoController)->store();
});

$router->get('/api/todos/{id}', function ($id) {
    AuthMiddleware::check();
    (new TodoController)->show($id);
});

$router->put('/api/todos/{id}', function ($id) {
    AuthMiddleware::check();
    (new TodoController)->update($id);
});

$router->patch('/api/todos/{id}/status', function ($id) {
    AuthMiddleware::check();
    (new TodoController)->updateStatus($id);
});

$router->delete('/api/todos/{id}', function ($id) {
    AuthMiddleware::check();
    (new TodoController)->delete($id);
});