<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryChange extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_id',
        'change_type',
        'quantity_change_main_unit',
        'quantity_change_sub_unit',
        'warehouse_from',
        'warehouse_to',
    ];

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
