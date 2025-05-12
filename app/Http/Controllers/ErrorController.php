<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ErrorController extends Controller
{
    public function forbidden(Request $request)
    {
        if ($request->inertia()) {
            // Pour les requêtes Inertia, on redirige vers la route du modal
            return inertia()->location(route('403'));
        }
 
        return Inertia::render('Errors/403', [
            'showModal' => true,
            'errorMessage' => 'Cette action n\'est pas autorisée.'
        ]);

        // Pour les requêtes standard
        abort(403, 'Cette action n\'est pas autorisée.');
    }
    
}