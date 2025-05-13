<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateUserRegisteredNotification 
{
    public function handle(UserRegistered $event)
    {
        // Empêche les doublons pour le même utilisateur
        if (Notification::where('notifiable_id', $event->user->id)
        ->where('type', 'new_user')
        ->exists()) {
        return;
            }
        // Obtenez tous les administrateurs pour leur envoyer la notification
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();

        foreach ($admins as $admin) {
            Notification::create([
                'type' => 'new_user',
                'user_id' => $admin->id,
                'notifiable_id' => $event->user->id,
                'notifiable_type' => User::class,
                'data' => [
                    'message' => "Nouveau utilisateur inscrit: {$event->user->name}",
                    'user_id' => $event->user->id,
                    'user_name' => $event->user->name
                ],
                'color' => 'blue'
            ]);
        }
    }
}