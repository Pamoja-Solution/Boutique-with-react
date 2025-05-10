<?php

use App\Models\Produit;
use App\Models\Rayon;
use App\Models\Vente;
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
        Schema::create('vente_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Vente::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Produit::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Rayon::class)->constrained()->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('prix_unitaire', 10, 2);
            $table->decimal('prix_vente', 10, 2); // Après application du type (détail/semi/gros)
            $table->decimal('tva_rate', 5, 2);
            $table->decimal('montant_tva', 10, 2);
            $table->decimal('montant_ht', 10, 2);
            $table->decimal('montant_ttc', 10, 2);
            $table->enum('type_vente', ['detail', 'semi_gros', 'gros']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vente_items');
    }
};
