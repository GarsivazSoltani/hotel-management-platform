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
        Schema::create('item_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->integer('quantity');
            $table->integer('priority')->default(2); // 1=فوری، 2=معمولی
            $table->string('status')->default('pending'); // pending/done
            $table->unsignedBigInteger('created_by'); // شف یا مدیر
            $table->unsignedBigInteger('completed_by')->nullable(); // کارمند
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('completed_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_requests');
    }
};
