<?php

namespace App\Http\Controllers;

use App\Models\Caisse;
use App\Models\CaisseMouvement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CaisseMouvementController extends Controller
{
    public function index(Caisse $caisse)
    {
        return Inertia::render('Caisse/Mouvements', [
            'caisse' => $caisse->load('devise'),
            'mouvements' => $caisse->mouvements()
                ->with('user')
                ->orderByDesc('created_at')
                ->paginate(10),
        ]);
    }

    public function store(Request $request, Caisse $caisse)
    {
        $request->validate([
            'type' => 'required|in:entree,sortie',
            'montant' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        // Vérifier le solde pour les sorties
        if ($request->type === 'sortie' && $caisse->solde_actuel < $request->montant) {
            return back()->with('error', 'Solde insuffisant pour effectuer cette opération');
        }

        // Créer le mouvement
        $mouvement = $caisse->mouvements()->create([
            'type' => $request->type,
            'montant' => $request->montant,
            'source_type' => 'ajustement',
            'description' => $request->description,
            'user_id' => auth()->id(),
        ]);

        // Mettre à jour le solde
        $caisse->update([
            'solde_actuel' => $request->type === 'entree' 
                ? $caisse->solde_actuel + $request->montant
                : $caisse->solde_actuel - $request->montant
        ]);

        return redirect()->back()->with('success', 'Mouvement enregistré avec succès');
    }

    public function destroy(Caisse $caisse, CaisseMouvement $mouvement)
    {
        // Annuler l'effet du mouvement
        $caisse->update([
            'solde_actuel' => $mouvement->type === 'entree'
                ? $caisse->solde_actuel - $mouvement->montant
                : $caisse->solde_actuel + $mouvement->montant
        ]);

        $mouvement->delete();

        return back()->with('success', 'Mouvement annulé avec succès');
    }
}