<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // دریافت لیست تمام محصولات
    public function index()
    {
        return response()->json(Product::all(), 200);
    }

    // ذخیره محصول جدید
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'stock' => 'required|integer|min:0',
                'price' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'warehouse_id' => 'required|exists:warehouses,id',
            ]);
    
            $product = Product::create($request->only(['name', 'stock', 'price', 'description', 'warehouse_id']));
            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // دریافت اطلاعات یک محصول خاص بر اساس ID
    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product, 200);
    }

    // بروزرسانی اطلاعات یک محصول
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'unit_type' => 'sometimes|string|max:50',
            'conversion_rate' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        $product->update($request->all());

        return response()->json($product, 200);
    }

    // حذف یک محصول بر اساس ID
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted'], 200);
    }
}
