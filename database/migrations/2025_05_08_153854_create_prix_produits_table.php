<?php

use App\Models\Produit;
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
        Schema::create('prix_produits', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Produit::class)->constrained()->cascadeOnDelete();
            $table->decimal('prix_detail', 10, 2);
            $table->integer('quantite_semi_gros')->default(4);
            $table->decimal('prix_semi_gros', 10, 2);
            $table->integer('quantite_gros')->default(10);
            $table->decimal('prix_gros', 10, 2);
            $table->decimal('prix_achat', 10, 2);
            $table->decimal('marge', 10, 2)->nullable();
            $table->date('date_effet');
            $table->date('date_fin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prix_produits');
    }
};
