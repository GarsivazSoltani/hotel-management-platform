<?php

namespace App\Http\Controllers;

use App\Models\InventoryChange;
use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryChangeController extends Controller
{
    // نمایش لیست همه تغییرات موجودی
    public function index()
    {
        $changes = InventoryChange::with(['inventory', 'warehouseFrom', 'warehouseTo'])->get();
        return response()->json($changes, 200);
    }

    // نمایش یک تغییر خاص بر اساس ID
    public function show($id)
    {
        $change = InventoryChange::with(['inventory', 'warehouseFrom', 'warehouseTo'])->find($id);
        if (!$change) {
            return response()->json(['error' => 'Inventory change not found.'], 404);
        }
        return response()->json($change, 200);
    }

    // ثبت تغییر موجودی جدید
    public function store(Request $request)
    {
        $request->validate([
            'inventory_id' => 'required|exists:inventories,id',
            'change_type' => 'required|string|in:entry,exit,transfer',
            'quantity_change_main_unit' => 'required|numeric|min:0.01',
            'quantity_change_sub_unit' => 'nullable|numeric',
            'warehouse_from' => 'nullable|exists:warehouses,id',
            'warehouse_to' => 'nullable|exists:warehouses,id',
        ]);

        $inventory = Inventory::findOrFail($request->inventory_id);

        // اگر مقدار quantity_change_sub_unit مقدار null داشت، آن را صفر قرار بده
        // $quantity_change_sub_unit = $request->quantity_change_sub_unit ?? 0;

        if ($request->change_type === 'entry') {
            // در حالت ورود: warehouse_from نباید مقدار داشته باشد
            if ($request->warehouse_from) {
                return response()->json(['error' => 'warehouse_from must be null for inventory entry.'], 400);
            }
            $inventory->quantity_main_unit += $request->quantity_change_main_unit;
        } elseif ($request->change_type === 'exit') {
            // در حالت خروج: warehouse_to نباید مقدار داشته باشد
            if ($request->warehouse_to) {
                return response()->json(['error' => 'warehouse_to must be null for inventory exit.'], 400);
            }
            if ($inventory->quantity_main_unit < $request->quantity_change_main_unit) {
                return response()->json(['error' => 'Insufficient inventory.'], 400);
            }
            $inventory->quantity_main_unit -= $request->quantity_change_main_unit;
        } elseif ($request->change_type === 'transfer') {
            // در حالت انتقال: هر دو مقدار warehouse_from و warehouse_to باید مقدار داشته باشند
            if (!$request->warehouse_from || !$request->warehouse_to) {
                return response()->json(['error' => 'Both warehouse_from and warehouse_to must be provided for transfer.'], 400);
            }
            if ($inventory->quantity_main_unit < $request->quantity_change_main_unit) {
                return response()->json(['error' => 'Insufficient inventory for transfer.'], 400);
            }
            // کم کردن موجودی از انبار مبدأ
            $inventory->quantity_main_unit -= $request->quantity_change_main_unit;

            // افزودن موجودی به انبار مقصد
            $targetInventory = Inventory::where('product_id', $inventory->product_id)
                ->where('warehouse_id', $request->warehouse_to)
                ->first();

            if ($targetInventory) {
                $targetInventory->quantity_main_unit += $request->quantity_change_main_unit;
                $targetInventory->save();
            } else {
                Inventory::create([
                    'product_id' => $inventory->product_id,
                    'warehouse_id' => $request->warehouse_to,
                    'quantity_main_unit' => $request->quantity_change_main_unit,
                    'quantity_sub_unit' => $request->quantity_change_sub_unit ?? 0,
                ]);
            }
        }

        // ذخیره تغییرات در موجودی اصلی
        $inventory->save();

        // ثبت تغییر در جدول Inventory_Changes
        $inventoryChange = InventoryChange::create([
            'inventory_id' => $request->inventory_id,
            'change_type' => $request->change_type,
            'quantity_change_main_unit' => $request->quantity_change_main_unit,
            'quantity_change_sub_unit' => $request->quantity_change_sub_unit ?? 0.00,
            'warehouse_from' => $request->warehouse_from,
            'warehouse_to' => $request->warehouse_to,
        ]);

        return response()->json($inventoryChange, 201);
    }

    // ویرایش تغییر موجودی (فقط مقادیر کمی تغییر می‌کند)
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity_change_main_unit' => 'nullable|numeric|min:0.01',
            'quantity_change_sub_unit' => 'nullable|numeric',
        ]);

        $change = InventoryChange::find($id);
        if (!$change) {
            return response()->json(['error' => 'Inventory change not found.'], 404);
        }

        $change->update($request->only(['quantity_change_main_unit', 'quantity_change_sub_unit']));

        return response()->json($change, 200);
    }

    // حذف یک تغییر موجودی
    public function destroy($id)
    {
        $change = InventoryChange::find($id);
        if (!$change) {
            return response()->json(['error' => 'Inventory change not found.'], 404);
        }

        $change->delete();
        return response()->json(['message' => 'Inventory change deleted.'], 200);
    }
}
