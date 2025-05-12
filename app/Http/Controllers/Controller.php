<?php

namespace App\Http\Controllers;

use App\Models\Caisse;
use Illuminate\Support\Facades\Request;

abstract class Controller
{
    //
    protected function sharedData(Request $request)
    {
        return [
            'caisses' => Caisse::with('devise')
                ->orderBy('is_active', 'desc')
                ->orderBy('name')
                ->get(),
            'currentCaisse' => Caisse::with('devise')
                ->where('is_active', true)
                ->first(),
            'auth' => [
                'user' => $request->user()
            ]
        ];
    }
}
