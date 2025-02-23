<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
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

        return response()->json($inventory, 201);
    }
}
