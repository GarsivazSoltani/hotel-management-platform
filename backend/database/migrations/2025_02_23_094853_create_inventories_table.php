<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');  // ارجاع به جدول محصولات
            $table->foreignId('warehouse_id')->constrained()->onDelete('cascade');  // ارجاع به جدول انبارها
            $table->decimal('quantity_main_unit', 10, 2)->default(0);  // مقدار موجودی در واحد اصلی
            $table->decimal('quantity_sub_unit', 10, 2)->default(0);  // مقدار موجودی در واحد فرعی
            $table->date('expiry_date')->nullable();  // تاریخ انقضا
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
