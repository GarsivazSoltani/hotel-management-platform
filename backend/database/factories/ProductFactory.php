<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,  // نام محصول به صورت تصادفی
            'description' => $this->faker->text,  // توضیحات محصول
            'price' => $this->faker->randomFloat(2, 10, 1000),  // قیمت محصول بین 10 و 1000
            'stock' => $this->faker->numberBetween(1, 100),  // تعداد موجودی محصول بین 1 و 100
            'warehouse_id' => Warehouse::inRandomOrder()->first()->id, // انتخاب یک انبار تصادفی
        ];
    }
}
