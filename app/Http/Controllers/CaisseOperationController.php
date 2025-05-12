<?php

namespace App\Http\Controllers;

use App\Models\Caisse;
use Illuminate\Http\Request;

class CaisseOperationController extends Controller
{
    public function depot(Request $request)
    {
        $request->validate([
            'montant' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255'
        ]);
        
        $caisse = Caisse::where('is_active', true)->firstOrFail();
        
        $caisse->update([
            'solde_actuel' => $caisse->solde_actuel + $request->montant
        ]);
        
        // Enregistrer l'opération dans l'historique si nécessaire
        
        return redirect()->back()
            ->with('success', 'Dépôt effectué avec succès');
    }

    public function retrait(Request $request)
    {
        $request->validate([
            'montant' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255'
        ]);
        
        $caisse = Caisse::where('is_active', true)->firstOrFail();
        
        if ($caisse->solde_actuel < $request->montant) {
            return redirect()->back()
                ->with('error', 'Solde insuffisant');
        }
        
        $caisse->update([
            'solde_actuel' => $caisse->solde_actuel - $request->montant
        ]);
        
        return redirect()->back()
            ->with('success', 'Retrait effectué avec succès');
    }
}