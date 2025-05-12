<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckForbiddenAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Si la réponse est une 403 et qu'on utilise Inertia
        if ($response->status() === 403 && $request->inertia()) {
            return inertia()->location(route('403'));
        }

        return $response;
    }
}