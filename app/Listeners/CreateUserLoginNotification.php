<?php

namespace App\Listeners;

use App\Events\UserLoggedIn;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateUserLoginNotification implements ShouldQueue
{
    public function handle(UserLoggedIn $event)
    {
        // Obtenez tous les administrateurs pour leur envoyer la notification
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();

        foreach ($admins as $admin) {
            Notification::create([
                'type' => 'user_login',
                'user_id' => $admin->id,
                'notifiable_id' => $event->user->id,
                'notifiable_type' => User::class,
                'data' => [
                    'message' => "{$event->user->name} s'est connecté",
                    'user_id' => $event->user->id,
                    'user_name' => $event->user->name
                ],
                'color' => 'blue'
            ]);
        }
    }
}