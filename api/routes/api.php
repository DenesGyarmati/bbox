<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtMiddleware;

Route::prefix('v1')->group(function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/roles', [UserController::class, 'roles']);
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::middleware([JwtMiddleware::class])->get('/users', [UserController::class, 'index']);

    Route::get('/ping', function () {
        return response()->json(['message' => 'pong']);
    });
});