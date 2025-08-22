<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/roles', [AuthController::class, 'roles']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/filter', [EventController::class, 'filter']);
    Route::get('/event/{id}', [EventController::class, 'show'])->middleware(['user']);
    // only auth
    Route::middleware(['jwt'])->group(function () {
        Route::middleware(['role:admin'])->group(function (){
            Route::get('/users', [AdminController::class, 'index']);
            Route::patch('/users/{id}/activate', [AdminController::class, 'activate']);
            Route::get('/admin/events',[AdminController::class, 'events']);
        });
        Route::middleware(['role:organizer'])->group(function () {
            Route::post('/events', [EventController::class, 'store']);
            Route::put('/events/{event}', [EventController::class, 'update']);
            Route::get('/events/my', [EventController::class, 'my']);
            Route::patch('/events/{event}/status', [EventController::class, 'status']);
        });
        Route::post('/reserve/{event}', [ReservationController::class, 'reserve']);
        Route::get('/reservations', [ReservationController::class, 'reservations']);
    });
});