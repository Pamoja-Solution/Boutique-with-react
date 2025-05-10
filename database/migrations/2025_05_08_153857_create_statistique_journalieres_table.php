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
        Schema::create('statistique_journalieres', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->integer('nombre_ventes')->default(0);
            $table->decimal('chiffre_affaire', 15, 2)->default(0);
            $table->decimal('benefice_brut', 15, 2)->default(0);
            $table->decimal('depenses', 15, 2)->default(0);
            $table->decimal('benefice_net', 15, 2)->default(0);
            $table->integer('nombre_clients')->default(0);
            $table->integer('produits_vendus')->default(0);
            $table->timestamps();
        });
    }

    /** 
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statistique_journalieres');
    }
};
