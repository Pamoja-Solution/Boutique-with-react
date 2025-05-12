<?php

namespace App\Http\Middleware;

use App\Models\Caisse;
use Closure;
use Inertia\Inertia;

class ShareCaisseData
{
    public function handle($request, Closure $next)
    {
        // Partagez ces données avec tous les composants Inertia
        Inertia::share([
            'lescaisses' => function () {
                return Caisse::with('devise')
                    ->orderBy('is_active', 'desc')
                    ->orderBy('name')
                    ->get();
            },
            'lacaisse' => function () {
                return Caisse::with('devise')
                    ->where('is_active', true)
                    ->first();
            }
        ]);

        return $next($request);
    }
}