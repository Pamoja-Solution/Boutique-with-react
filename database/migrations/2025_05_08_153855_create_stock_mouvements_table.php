<?php

use App\Models\Produit;
use App\Models\Rayon;
use App\Models\User;
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
        Schema::create('stock_mouvements', function (Blueprint $table) {
            $table->id();
            
            $table->foreignIdFor(Produit::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Rayon::class)->constrained()->cascadeOnDelete();

            $table->integer('quantity');
            $table->enum('type', ['entree', 'sortie', 'ajustement', 'transfert']);
            $table->text('motif')->nullable();
            //$table->foreignId('user_id')->constrained();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_mouvements');
    }
};
