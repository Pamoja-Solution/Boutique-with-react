<?php

use App\Models\Client;
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
        Schema::create('ventes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Numéro de ticket/facture
            $table->foreignIdFor(Client::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();

            $table->decimal('total_ht', 10, 2);
            $table->decimal('total_tva', 10, 2);
            $table->decimal('total_ttc', 10, 2);
            $table->decimal('montant_remise', 10, 2)->default(0);
            $table->decimal('montant_paye', 10, 2);
            $table->decimal('remise', 10, 2)->default(0);
            $table->enum('statut', ['encours', 'terminee', 'annulee'])->default('terminee');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventes');
    }
};
