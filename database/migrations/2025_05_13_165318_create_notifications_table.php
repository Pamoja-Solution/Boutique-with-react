<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'stock_alerte', 'user_login', 'new_user', 'vente', etc.
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->morphs('notifiable'); // Pour associer la notification à différents modèles
            $table->text('data'); // JSON des données spécifiques à la notification
            $table->string('icon')->nullable(); // Classe d'icône ou chemin
            $table->string('color')->default('blue'); // Couleur de la notification (rouge, vert, bleu, etc.)
            $table->timestamp('read_at')->nullable(); // Pour marquer comme lue
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};