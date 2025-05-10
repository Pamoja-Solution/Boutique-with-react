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
        

        
        Schema::create('articles_vente', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Vente::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Produit::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Rayon::class)->constrained()->cascadeOnDelete();
            $table->integer('quantite');
            $table->decimal('prix_unitaire', 10, 2);
            $table->decimal('taux_tva', 5, 2);
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
        Schema::dropIfExists('articles_vente');
    }
};
