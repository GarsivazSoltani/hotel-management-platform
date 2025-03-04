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
        Schema::table('item_requests', function (Blueprint $table) {
            $table->string('direction')->default('out')->after('quantity'); // 'out' یا 'in'
            $table->text('note')->nullable()->after('direction'); // توضیحات اختیاری
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_requests', function (Blueprint $table) {
            $table->dropColumn(['direction', 'note']);
        });
    }
};
