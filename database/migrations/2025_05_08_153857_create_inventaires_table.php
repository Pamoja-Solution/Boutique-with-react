<?php

use App\Models\Inventaire;
use App\Models\Produit;
use App\Models\Rayon;
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
        Schema::create('inventaire_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Inventaire::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Produit::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Rayon::class)->constrained()->cascadeOnDelete();
            $table->integer('quantite_theorique')->default(0);
            $table->integer('quantite_reelle')->default(0);
            $table->integer('ecart')->default(0);
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventaire_items');
    }
};
