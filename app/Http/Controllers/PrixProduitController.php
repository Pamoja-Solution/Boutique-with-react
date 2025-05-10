<?php

namespace App\Http\Controllers;

use App\Models\PrixProduit;
use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrixProduitController extends Controller
{
    public function index(Produit $produit)
    {
        return Inertia::render('Produit/PrixManager', [
            'produit' => $produit->load('categorie'),
            'historiquePrix' => PrixProduit::where('produit_id', $produit->id)
                ->orderBy('date_effet', 'desc')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'prix_detail' => 'required|numeric|min:0',
            'quantite_semi_gros' => 'required|integer|min:1',
            'prix_semi_gros' => 'required|numeric|min:0',
            'quantite_gros' => 'required|integer|min:1',
            'prix_gros' => 'required|numeric|min:0',
            'prix_achat' => 'required|numeric|min:0',
            'date_effet' => 'required|date|after_or_equal:today',
        ]);

        // Calculer la marge automatiquement
        $marge = $request->prix_detail - $request->prix_achat;

        // Désactiver les anciens prix à partir de la date d'effet
        PrixProduit::where('produit_id', $request->produit_id)
            ->whereNull('date_fin')
            ->update(['date_fin' => $request->date_effet]);

        // Créer le nouveau prix
        PrixProduit::create([
            'produit_id' => $request->produit_id,
            'prix_detail' => $request->prix_detail,
            'quantite_semi_gros' => $request->quantite_semi_gros,
            'prix_semi_gros' => $request->prix_semi_gros,
            'quantite_gros' => $request->quantite_gros,
            'prix_gros' => $request->prix_gros,
            'prix_achat' => $request->prix_achat,
            'marge' => $marge,
            'date_effet' => $request->date_effet,
        ]);

        return redirect()->back()->with('success', 'Prix mis à jour avec succès');
    }

    public function update(Request $request, PrixProduit $prixProduit)
    {
        $request->validate([
            'prix_detail' => 'required|numeric|min:0',
            'quantite_semi_gros' => 'required|integer|min:1',
            'prix_semi_gros' => 'required|numeric|min:0',
            'quantite_gros' => 'required|integer|min:1',
            'prix_gros' => 'required|numeric|min:0',
            'prix_achat' => 'required|numeric|min:0',
            'date_effet' => 'required|date',
        ]);

        // Calculer la marge automatiquement
        $marge = $request->prix_detail - $request->prix_achat;

        $prixProduit->update([
            'prix_detail' => $request->prix_detail,
            'quantite_semi_gros' => $request->quantite_semi_gros,
            'prix_semi_gros' => $request->prix_semi_gros,
            'quantite_gros' => $request->quantite_gros,
            'prix_gros' => $request->prix_gros,
            'prix_achat' => $request->prix_achat,
            'marge' => $marge,
            'date_effet' => $request->date_effet,
            'date_fin' => $request->date_fin,
        ]);

        return redirect()->back()->with('success', 'Prix modifié avec succès');
    }

    public function destroy(PrixProduit $prixProduit)
    {
        $prixProduit->delete();
        
        return redirect()->back()->with('success', 'Prix supprimé avec succès');
    }
}