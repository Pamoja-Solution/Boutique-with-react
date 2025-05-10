<?php

namespace App\Http\Controllers;

use App\Models\Inventaire;
use App\Models\InventaireItem;
use App\Models\Produit;
use App\Models\Rayon;
use Illuminate\Http\Request;

class InventaireItemController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Inventaire $inventaire)
    {
        // Vérification que l'inventaire est modifiable
        if (!in_array($inventaire->statut, ['planifie', 'encours'])) {
            return redirect()->back()
                ->with('error', "Impossible d'ajouter des produits à un inventaire qui n'est pas en cours.");
        }
        
        $validated = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'rayon_id' => 'required|exists:rayons,id',
            'quantite_theorique' => 'required|integer|min:0',
            'quantite_reelle' => 'required|integer|min:0',
            'commentaire' => 'nullable|string',
        ]);
        
        // Vérification si ce produit est déjà dans l'inventaire
        $existingItem = InventaireItem::where('inventaire_id', $inventaire->id)
            ->where('produit_id', $validated['produit_id'])
            ->where('rayon_id', $validated['rayon_id'])
            ->first();
            
        if ($existingItem) {
            return redirect()->back()
                ->with('error', 'Ce produit est déjà dans l\'inventaire pour ce rayon.');
        }
        
        // Calcul de l'écart
        $ecart = $validated['quantite_reelle'] - $validated['quantite_theorique'];
        
        // Création de l'item
        $item = new InventaireItem();
        $item->inventaire_id = $inventaire->id;
        $item->produit_id = $validated['produit_id'];
        $item->rayon_id = $validated['rayon_id'];
        $item->quantite_theorique = $validated['quantite_theorique'];
        $item->quantite_reelle = $validated['quantite_reelle'];
        $item->ecart = $ecart;
        $item->commentaire = $validated['commentaire'] ?? null;
        $item->save();
        
        return redirect()->back()
            ->with('success', 'Produit ajouté à l\'inventaire.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventaire $inventaire, InventaireItem $item)
    {
        // Vérification que l'inventaire est modifiable
        if (!in_array($inventaire->statut, ['planifie', 'encours'])) {
            return redirect()->back()
                ->with('error', "Impossible de modifier des produits d'un inventaire qui n'est pas en cours.");
        }
        
        // Vérification que l'item appartient bien à cet inventaire
        if ($item->inventaire_id !== $inventaire->id) {
            return redirect()->back()
                ->with('error', "Cet item n'appartient pas à l'inventaire spécifié.");
        }
        
        $validated = $request->validate([
            'quantite_theorique' => 'required|integer|min:0',
            'quantite_reelle' => 'required|integer|min:0',
            'commentaire' => 'nullable|string',
        ]);
        
        // Calcul de l'écart
        $ecart = $validated['quantite_reelle'] - $validated['quantite_theorique'];
        
        // Mise à jour de l'item
        $item->quantite_theorique = $validated['quantite_theorique'];
        $item->quantite_reelle = $validated['quantite_reelle'];
        $item->ecart = $ecart;
        $item->commentaire = $validated['commentaire'] ?? null;
        $item->save();
        
        return redirect()->back()
            ->with('success', 'Item d\'inventaire mis à jour.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventaire $inventaire, InventaireItem $item)
    {
        // Vérification que l'inventaire est modifiable
        if (!in_array($inventaire->statut, ['planifie', 'encours'])) {
            return redirect()->back()
                ->with('error', "Impossible de supprimer des produits d'un inventaire qui n'est pas en cours.");
        }
        
        // Vérification que l'item appartient bien à cet inventaire
        if ($item->inventaire_id !== $inventaire->id) {
            return redirect()->back()
                ->with('error', "Cet item n'appartient pas à l'inventaire spécifié.");
        }
        
        $item->delete();
        
        return redirect()->back()
            ->with('success', 'Produit retiré de l\'inventaire.');
    }
}