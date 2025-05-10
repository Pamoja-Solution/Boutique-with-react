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
        Schema::create('devises', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // USD, EUR, XAF, etc.
            $table->string('symbole');
            $table->decimal('taux_achat', 10, 4); // Taux pour acheter la devise
            $table->decimal('taux_vente', 10, 4); // Taux pour vendre la devise
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devises');
    }
};
