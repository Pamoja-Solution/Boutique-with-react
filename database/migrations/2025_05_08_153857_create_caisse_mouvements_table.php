<?php

use App\Models\Caisse;
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
        Schema::create('caisse_mouvements', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Caisse::class)->constrained()->cascadeOnDelete();

            $table->enum('type', ['entree', 'sortie']);
            $table->decimal('montant', 10, 2);
            $table->string('source_type'); // Vente, Depense, Ajustement, etc.
            $table->text('description')->nullable();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caisse_mouvements');
    }
};
