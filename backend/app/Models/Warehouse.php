<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'warehouse_id');
    }
}
