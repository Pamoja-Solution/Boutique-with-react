<?php

namespace App\Providers;

use App\Events\LowStockAlert;
use App\Events\UserLoggedIn;
use App\Events\UserRegistered;
use App\Events\VenteCompleted;
use App\Listeners\CreateLowStockNotification;
use App\Listeners\CreateUserLoginNotification;
use App\Listeners\CreateUserRegisteredNotification;
use App\Listeners\CreateVenteNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UserLoggedIn::class => [
            CreateUserLoginNotification::class,
        ],
        UserRegistered::class => [
            CreateUserRegisteredNotification::class,
        ],
        LowStockAlert::class => [
            CreateLowStockNotification::class,
        ],
        VenteCompleted::class => [
            CreateVenteNotification::class,
        ],
    ];

    public function boot()
    {
        //
    }
}