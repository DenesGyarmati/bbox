<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/roles', [UserController::class, 'roles']);
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::get('/event/{id}', [EventController::class, 'show']);
    // only auth
    Route::middleware(['jwt'])->group(function () {
        Route::middleware(['role:admin'])->group(function (){
            Route::get('/users', [UserController::class, 'index']);
            Route::patch('/users/{id}/activate', [UserController::class, 'activate']);
        });
        Route::middleware(['role:organizer'])->group(function () {
            Route::post('/events', [EventController::class, 'store']);
            Route::put('/events/{id}', [EventController::class, 'update']);
            Route::get('/events/my', [EventController::class, 'my']);
        });
    });
});