<?php

namespace App\Listeners;

use App\Events\VenteCompleted;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateVenteNotification 
{
    public function handle(VenteCompleted $event)
    {
        $admins = User::whereHas('role', fn($q) => $q->where('name', 'admin'))->get();

        foreach ($admins as $admin) {
            // Vérifie si une notification identique existe déjà
            $exists = Notification::where('type', 'vente')
                ->where('user_id', $admin->id)
                ->where('notifiable_id', $event->vente->id)
                ->exists();

            if (!$exists) {
                Notification::create([
                    'type' => 'vente',
                    'user_id' => $admin->id,
                    'notifiable_id' => $event->vente->id,
                    'notifiable_type' => get_class($event->vente),
                    'data' => [
                        'message' => "Vente #{$event->vente->code} effectuée",
                        'vente_id' => $event->vente->id,
                        'vente_code' => $event->vente->code,
                        'montant' => $event->vente->total_ttc,
                        'client' => $event->vente->client->name
                    ],
                    'color' => 'green'
                ]);
            }
        }
    }
}