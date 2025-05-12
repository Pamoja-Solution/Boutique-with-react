<?php

use App\Models\Devise;
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
        Schema::create('depenses', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();

            $table->decimal('montant', 10, 2);
            $table->foreignIdFor(Devise::class)->constrained()->cascadeOnDelete();
            $table->text('description');
            $table->enum('mode_paiement', ['espece', 'carte', 'cheque', 'mobile_money']);
            $table->string('beneficiaire')->nullable();
            $table->date('date_depense');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depenses');
    }
};
