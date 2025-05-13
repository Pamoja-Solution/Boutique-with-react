<?php

namespace App\Http\Controllers;

use App\Events\LowStockAlert;
use App\Models\Produit;
use App\Models\Rayon;
use App\Models\Stock;
use App\Models\StockMouvement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Produit $produit = null)
    {
        $query = Stock::with(['produit', 'rayon']);
        
        if ($produit) {
            $query->where('produit_id', $produit->id);
        }
        
        $stocks = $query->get();
        
        return Inertia::render('Stock/StockManager', [
            'produit' => $produit,
            'stocks' => $stocks,
            'produits' => $produit ? null : Produit::where('actif', true)->get(),
            'rayons' => Rayon::all(),
        ]);
    }

    public function transfert(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'rayon_source_id' => 'required|exists:rayons,id',
            'rayon_destination_id' => 'required|exists:rayons,id|different:rayon_source_id',
            'quantite' => 'required|integer|min:1',
            'motif' => 'nullable|string',
        ]);

        // Vérifier que le stock source est suffisant
        $stockSource = Stock::where('produit_id', $request->produit_id)
                          ->where('rayon_id', $request->rayon_source_id)
                          ->first();

        if (!$stockSource || $stockSource->quantite < $request->quantite) {
            return redirect()->back()->with('error', 'Stock insuffisant pour effectuer le transfert');
        }

        // Diminuer le stock source
        $stockSource->quantite -= $request->quantite;
        $stockSource->save();

        

        if ($stockSource->quantite <= $stockSource->quantite_alerte) {
        event(new LowStockAlert($stockSource, $stockSource));
        }
        // Enregistrer le mouvement de sortie
        StockMouvement::create([
            'produit_id' => $request->produit_id,
            'rayon_id' => $request->rayon_source_id,
            'quantity' => $request->quantite,
            'type' => 'transfert',
            'motif' => "Transfert vers " . Rayon::find($request->rayon_destination_id)->nom . ": " . $request->motif,
            'user_id' => auth()->id()
        ]);

        // Augmenter ou créer le stock destination
        $stockDestination = Stock::firstOrCreate(
            ['produit_id' => $request->produit_id, 'rayon_id' => $request->rayon_destination_id],
            ['quantite' => 0, 'quantite_alerte' => $stockSource->quantite_alerte]
        );
        
        $stockDestination->quantite += $request->quantite;
        $stockDestination->save();

        // Enregistrer le mouvement d'entrée
        StockMouvement::create([
            'produit_id' => $request->produit_id,
            'rayon_id' => $request->rayon_destination_id,
            'quantity' => $request->quantite,
            'type' => 'transfert',
            'motif' => "Transfert depuis " . Rayon::find($request->rayon_source_id)->nom . ": " . $request->motif,
            'user_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Transfert de stock effectué avec succès');
    }
}
