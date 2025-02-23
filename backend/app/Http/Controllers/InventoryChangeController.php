<?php

namespace App\Http\Controllers;

use App\Models\InventoryChange;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class InventoryChangeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'inventory_id' => 'required|exists:inventories,id',
            'change_type' => 'required|string|in:in,out,transfer',
            'quantity_change_main_unit' => 'required|numeric',
            'quantity_change_sub_unit' => 'nullable|numeric',
            'warehouse_from' => 'nullable|exists:warehouses,id',
            'warehouse_to' => 'nullable|exists:warehouses,id',
        ]);

        $inventoryChange = InventoryChange::create([
            'inventory_id' => $request->inventory_id,
            'change_type' => $request->change_type,
            'quantity_change_main_unit' => $request->quantity_change_main_unit,
            'quantity_change_sub_unit' => $request->quantity_change_sub_unit,
            'warehouse_from' => $request->warehouse_from,
            'warehouse_to' => $request->warehouse_to,
        ]);

        return response()->json($inventoryChange, 201);
    }
}
