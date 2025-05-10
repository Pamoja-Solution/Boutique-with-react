<?php

use App\Models\Devise;
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
        Schema::create('caisses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('solde_initial', 10, 2)->default(0);
            $table->decimal('solde_actuel', 10, 2)->default(0);
            $table->foreignIdFor(Devise::class)->constrained()->cascadeOnDelete();

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caisses');
    }
};
