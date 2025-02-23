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
        Schema::create('inventory_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained()->onDelete('cascade');  // ارجاع به جدول Inventory
            $table->enum('change_type', ['entry', 'exit', 'transfer']);  // نوع تغییر (ورود، خروج، انتقال)
            $table->decimal('quantity_change_main_unit', 10, 2)->default(0);  // مقدار تغییر در واحد اصلی
            $table->decimal('quantity_change_sub_unit', 10, 2)->default(0);  // مقدار تغییر در واحد فرعی
            $table->foreignId('warehouse_from')->nullable()->constrained('warehouses')->onDelete('set null');  // انبار مبدا (اختیاری)
            $table->foreignId('warehouse_to')->nullable()->constrained('warehouses')->onDelete('set null');  // انبار مقصد (اختیاری)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_changes');
    }
};
