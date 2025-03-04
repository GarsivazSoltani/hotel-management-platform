<?php

namespace App\Http\Controllers;

use App\Models\ItemRequest;
use Illuminate\Http\Request;

class ItemRequestController extends Controller
{
    public function index()
    {
        return ItemRequest::with('product', 'warehouse')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity' => 'required|integer|min:1',
            'direction' => 'required|in:out,in',
            'note' => 'nullable|string|max:255',
            'priority' => 'required|in:1,2',
            'created_by' => 'required|exists:users,id',
        ]);
    
        $requestData = $request->only(['product_id', 'warehouse_id', 'quantity', 'direction', 'note', 'priority', 'created_by']);
        $requestData['status'] = 'pending';
    
        $itemRequest = ItemRequest::create($requestData);
        return response()->json($itemRequest, 201);
    }

    public function update(Request $request, $id)
    {
        $itemRequest = ItemRequest::findOrFail($id);
        $request->validate([
            'status' => 'required|in:pending,done',
            'completed_by' => 'required_if:status,done|exists:users,id',
        ]);

        $itemRequest->update($request->only(['status', 'completed_by']));
        return response()->json($itemRequest);
    }
}