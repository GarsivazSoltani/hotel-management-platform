<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Inventory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Inventory::class;
    
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()->id, // انتخاب یک محصول تصادفی
            'warehouse_id' => Warehouse::inRandomOrder()->first()->id, // انتخاب یک انبار تصادفی
            'quantity_main_unit' => $this->faker->randomNumber(2), // مقدار موجودی در واحد اصلی
            'quantity_sub_unit' => $this->faker->randomNumber(1), // مقدار موجودی در واحد فرعی
            'expiry_date' => $this->faker->date(), // تاریخ انقضا
        ];
    }
}
