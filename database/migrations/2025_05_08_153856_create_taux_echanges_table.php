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
        Schema::create('taux_echanges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devise_source_id')->constrained('devises');
            $table->foreignId('devise_cible_id')->constrained('devises');
            $table->decimal('taux', 10, 4);
            $table->date('date_effet');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taux_echanges');
    }
};
