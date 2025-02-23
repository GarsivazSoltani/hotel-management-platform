<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // این دستور 10 محصول تصادفی ایجاد می‌کند
        // Product::factory(10)->create();
        Product::factory()->count(50)->create();
    }
}
