<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController as PublicProductController;
use App\Http\Controllers\HomepageController as PublicHomepageController;
use App\Http\Controllers\AboutUsController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\HomepageController as ApiHomepageController;
use App\Http\Controllers\Api\AboutUsController as ApiAboutUsController;
use App\Http\Controllers\Api\WebsiteSettingController as ApiWebsiteSettingController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Public MURU REST API Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json(['message' => 'MURU API is running']);
});

// Products API
Route::get('/products', [PublicProductController::class, 'index']);
Route::get('/products/{slug}', [PublicProductController::class, 'show']);
Route::get('/products/{slug}/related', [PublicProductController::class, 'related']);

// Homepage API
Route::get('/homepage', [PublicHomepageController::class, 'show']);

// Pages API
Route::get('/about-us', [AboutUsController::class, 'show']);

// Settings API
Route::get('/settings', [SettingController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Admin Auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    // Admin Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);

    // Website Settings Management
    Route::get('/admin/settings', [ApiWebsiteSettingController::class, 'index']);
    Route::post('/admin/settings', [ApiWebsiteSettingController::class, 'update']);
    Route::post('/admin/contact', [SettingController::class, 'update']);

    // Homepage Management
    Route::get('/admin/homepage', [ApiHomepageController::class, 'index']);
    Route::post('/admin/homepage', [ApiHomepageController::class, 'update']);

    // About Us Management
    Route::get('/admin/about', [ApiAboutUsController::class, 'index']);
    Route::post('/admin/about', [ApiAboutUsController::class, 'update']);

    // Product Management
    Route::apiResource('/admin/products', ProductController::class);
    Route::patch('/admin/products/{id}/toggle-status', [ProductController::class, 'toggleStatus']);
    Route::post('/admin/products/{id}/images', [ProductController::class, 'uploadImages']);
    Route::patch('/admin/products/{id}/images/{imageId}/primary', [ProductController::class, 'setPrimaryImage']);
    Route::delete('/admin/products/{id}/images/{imageId}', [ProductController::class, 'deleteImage']);
});
