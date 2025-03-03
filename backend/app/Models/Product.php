<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'stock', 'price', 'description', 'warehouse_id'];

    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'product_id');
    }
}
