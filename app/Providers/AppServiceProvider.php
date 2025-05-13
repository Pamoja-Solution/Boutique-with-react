<?php

namespace App\Providers;

use App\Models\Depense;
use App\Models\Stock;
use App\Models\User;
use App\Observers\StockObserver;
use App\Policies\DepensePolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Depense::class => DepensePolicy::class,
        // Ajoutez d'autres modèles/policies ici
    ];
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //$this->registerPolicies();

        // Définir des gates globaux
        Gate::define('access-dashboard', fn (User $user) => $user->isAdminOrManager());
        Gate::define('manage-products', fn (User $user) => $user->canManageProducts());
        Vite::prefetch(concurrency: 3);
        Stock::observe(StockObserver::class);

    }
}
