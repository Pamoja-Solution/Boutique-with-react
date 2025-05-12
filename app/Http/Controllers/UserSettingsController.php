<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserSettingsController extends Controller
{
    public function edit()
{
    $user = auth()->user();
    
    
    // Récupère le thème depuis la base ou utilise 'light' par défaut
    $userTheme = data_get($user->settings, 'theme', 'light');
    
    return Inertia::render('Settings/Edit', [
        'initialSettings' => [
            'theme' => $userTheme,
            'font' => data_get($user->settings, 'font', 'sans'),
            'compact_mode' => data_get($user->settings, 'compact_mode', false),
            'notifications' => data_get($user->settings, 'notifications', true),
        ],
        'availableThemes' => [
            'light', 'dark', 'cupcake', 'bumblebee', 'emerald',
            'corporate', 'synthwave', 'retro', 'cyberpunk',
            'valentine', 'halloween', 'garden', 'forest',
            'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe',
            'black', 'luxury', 'dracula', 'cmyk', 'autumn',
            'business', 'acid', 'lemonade', 'night', 'coffee',
            'winter'
        ],
        'availableFonts' => [
            'sans' => 'Sans-serif',
            'serif' => 'Serif',
            'mono' => 'Monospace',
            'rounded' => 'Arrondi',
            'ubuntu' => 'Ubuntu',
            'dancing' => 'Dancing Script',
            'comfortaa' => 'Comfortaa',
            'poppins' => 'Poppins',
            'roboto' => 'Roboto',
            'montserrat' => 'Montserrat',
            'playfair' => 'Playfair Display',
            'lato' => 'Lato',
            'raleway' => 'Raleway',
            'nunito' => 'Nunito',
            'pacifico' => 'Pacifico',
            'oswald' => 'Oswald',
            'quicksand' => 'Quicksand'
        ]
    ]);
}

    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|string',
            'font' => 'required|string',
            'compact_mode' => 'boolean',
            'notifications' => 'boolean',
        ]);

        $user = auth()->user();
        $user->settings = array_merge((array)$user->settings, $validated);
        $user->save();

        return redirect()->back()->with('success', 'Paramètres enregistrés avec succès');
    }
}