<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserLoggedIn;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        // Vérification du status de l'utilisateur
        if (Auth::user()->is_active == 0) {
            Auth::logout();

            // Facultatif : nettoyage session si nécessaire
            Session::invalidate();
            Session::regenerateToken();
            session()->flash('error', 'Votre compte est désactivé.');

            // Redirection avec message d'erreur
            return redirect(route('login'))->with('error','Votre compte est désactivé.');
        }

        $request->session()->regenerate();
        event(new UserLoggedIn(auth()->user()));

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
