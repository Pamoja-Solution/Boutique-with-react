<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Rayon;
use App\Models\Stock;
use App\Models\StockMouvement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMouvementController extends Controller
{
    public function index(Produit $produit = null, Rayon $rayon = null)
    {
        $query = StockMouvement::with(['produit', 'rayon', 'user']);
        
        if ($produit) {
            $query->where('produit_id', $produit->id);
        }
        
        if ($rayon) {
            $query->where('rayon_id', $rayon->id);
        }
        
        $mouvements = $query->orderBy('created_at', 'desc')->paginate(25);
        
        return Inertia::render('Stock/MouvementManager', [
            'mouvements' => $mouvements,
            'produit' => $produit,
            'rayon' => $rayon,
            'produits' => $produit ? null : Produit::where('actif', true)->get(),
            'rayons' => $rayon ? null : Rayon::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'rayon_id' => 'required|exists:rayons,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:entree,sortie,ajustement,transfert',
            'motif' => 'nullable|string'
        ]);

        // Trouver ou créer le stock
        $stock = Stock::firstOrCreate(
            ['produit_id' => $request->produit_id, 'rayon_id' => $request->rayon_id],
            ['quantite' => 0, 'quantite_alerte' => 10]
        );

        // Vérifier si on a assez de stock pour une sortie
        if ($request->type === 'sortie' && $stock->quantite < $request->quantity) {
            return redirect()->back()->with('error', 'Stock insuffisant pour cette opération');
        }

        // Mettre à jour la quantité
        switch ($request->type) {
            case 'entree':
                $stock->quantite += $request->quantity;
                break;
            case 'sortie':
                $stock->quantite = max(0, $stock->quantite - $request->quantity);
                break;
            case 'ajustement':
                $stock->quantite = $request->quantity;
                break;
        }

        $stock->save();

        // Enregistrer le mouvement
        StockMouvement::create([
            'produit_id' => $request->produit_id,
            'rayon_id' => $request->rayon_id,
            'quantity' => $request->quantity,
            'type' => $request->type,
            'motif' => $request->motif,
            'user_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Mouvement de stock enregistré');
    }
}