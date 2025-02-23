<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inventory extends Model
{
    use HasFactory;
    
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }
    
    public function inventoryChanges()
    {
        return $this->hasMany(InventoryChange::class, 'inventory_id');
    }
    
}
