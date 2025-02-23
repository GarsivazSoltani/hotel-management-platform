<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Warehouse;


class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Warehouse::create([
            'name' => 'Main Warehouse',
            'location' => 'Building A',
            // سایر فیلدهای مورد نیاز
        ]);
    
        Warehouse::create([
            'name' => 'Secondary Warehouse',
            'location' => 'Building B',
            // سایر فیلدها
        ]);
    }
}
