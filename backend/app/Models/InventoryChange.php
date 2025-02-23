<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryChange extends Model
{
    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'inventory_id');
    }
    
    public function warehouseFrom()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_from');
    }
    
    public function warehouseTo()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_to');
    }
    
}
