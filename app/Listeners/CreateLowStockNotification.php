<?php

namespace App\Listeners;

use App\Events\LowStockAlert;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateLowStockNotification implements ShouldQueue
{
    public function handle(LowStockAlert $event)
    {
        // Obtenez tous les administrateurs pour leur envoyer la notification
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();

        foreach ($admins as $admin) {
            Notification::create([
                'type' => 'stock_alerte',
                'user_id' => $admin->id,
                'notifiable_id' => $event->produit->id,
                'notifiable_type' => get_class($event->produit),
                'data' => [
                    'message' => "Stock faible: {$event->produit->nom}",
                    'produit_id' => $event->produit->id,
                    'produit_nom' => $event->produit->nom,
                    'quantite' => $event->stock->quantite,
                    'quantite_alerte' => $event->stock->quantite_alerte,
                    'rayon' => $event->stock->rayon->nom
                ],
                'color' => 'red'
            ]);
        }
    }
}