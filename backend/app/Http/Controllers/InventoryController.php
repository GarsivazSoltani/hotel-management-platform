<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    // ذخیره موجودی جدید
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity_main_unit' => 'required|numeric',
            'quantity_sub_unit' => 'nullable|numeric',
        ]);

        $inventory = Inventory::create([
            'product_id' => $request->product_id,
            'warehouse_id' => $request->warehouse_id,
            'quantity_main_unit' => $request->quantity_main_unit,
            'quantity_sub_unit' => $request->quantity_sub_unit,
        ]);

        // return response()->json($inventory, 201);
        return response()->json([
            'message' => 'Inventory created successfully!',
            'inventory' => $inventory
        ], 201);
        
    }

    // نمایش لیست موجودی‌ها
    public function index()
    {
        $inventories = Inventory::all();
        return response()->json($inventories);
    }

    // نمایش موجودی خاص
    public function show($id)
    {
        $inventory = Inventory::findOrFail($id);
        return response()->json($inventory);
    }

    // ویرایش موجودی
    public function update(Request $request, $id)
    {
        $inventory = Inventory::find($id);
        if (!$inventory) {
            return response()->json(['message' => 'Inventory not found'], 404);
        }
    
        // چک کنیم که محصول و انبار هنوز در دیتابیس هستن
        if (!Product::find($request->product_id)) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        if (!Warehouse::find($request->warehouse_id)) {
            return response()->json(['message' => 'Warehouse not found'], 404);
        }
    
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity_main_unit' => 'required|numeric',
            'quantity_sub_unit' => 'nullable|numeric',
        ]);
    
        $inventory->update($request->all());
    
        return response()->json($inventory);
    }

    // حذف موجودی
    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();

        return response()->json(null, 204);
    }
}
