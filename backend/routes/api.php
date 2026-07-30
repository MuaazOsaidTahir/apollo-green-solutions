<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Welcome to the Apollo Green Solutions API',
    ]);
});
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth.simple')->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('workspaces', WorkspaceController::class);

    Route::get('workspaces/{workspace}/tasks/{status}', [TaskController::class, 'index']);
    Route::get('tasks/stats', [TaskController::class, 'stats']);
    Route::post('workspaces/{workspace}/tasks', [TaskController::class, 'store']);

    Route::get('tasks/{task}', [TaskController::class, 'show']);
    Route::put('tasks/{task}', [TaskController::class, 'update']);
    Route::delete('tasks/{task}', [TaskController::class, 'destroy']);
});