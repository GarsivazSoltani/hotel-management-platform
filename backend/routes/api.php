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

// Route::post('/inventories', [InventoryController::class, 'store']);
Route::prefix('inventories')->group(function () {
    Route::get('/', [InventoryController::class, 'index']); // نمایش لیست موجودی‌ها
    Route::post('/', [InventoryController::class, 'store']); // ایجاد موجودی جدید
    Route::get('{id}', [InventoryController::class, 'show']); // نمایش موجودی خاص
    Route::put('{id}', [InventoryController::class, 'update']); // ویرایش موجودی
    Route::delete('{id}', [InventoryController::class, 'destroy']); // حذف موجودی
});



// Route::post('/inventory-changes', [InventoryChangeController::class, 'store']);
Route::prefix('inventory-changes')->group(function () {
    Route::get('/', [InventoryChangeController::class, 'index']); // لیست همه تغییرات
    Route::get('/{id}', [InventoryChangeController::class, 'show']); // نمایش یک تغییر خاص
    Route::post('/', [InventoryChangeController::class, 'store']); // ایجاد تغییر جدید
    Route::put('/{id}', [InventoryChangeController::class, 'update']); // ویرایش تغییر
    Route::delete('/{id}', [InventoryChangeController::class, 'destroy']); // حذف تغییر
});
