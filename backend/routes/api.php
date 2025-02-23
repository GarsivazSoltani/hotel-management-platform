<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\InventoryChangeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/test', [TestController::class, 'handle']);


Route::post('/inventories', [InventoryController::class, 'store']);
Route::post('/inventory-changes', [InventoryChangeController::class, 'store']);

// Route::post('/warehouses', [WarehouseController::class, 'store']);
Route::prefix('warehouses')->group(function () {
    Route::get('/', [WarehouseController::class, 'index']); // نمایش لیست انبارها
    Route::post('/', [WarehouseController::class, 'store']); // ایجاد انبار جدید
    Route::get('{id}', [WarehouseController::class, 'show']); // نمایش انبار خاص
    Route::put('{id}', [WarehouseController::class, 'update']); // ویرایش انبار
    Route::delete('{id}', [WarehouseController::class, 'destroy']); // حذف انبار
});


// Route::post('/products', [ProductController::class, 'store']);
Route::apiResource('products', ProductController::class);


