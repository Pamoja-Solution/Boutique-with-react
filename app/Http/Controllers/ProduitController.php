<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Categorie;
use App\Models\Rayon;
use App\Models\PrixProduit;
use App\Models\Stock;
use App\Models\StockMouvement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProduitController extends Controller
{
    public function index()
    {
        return Inertia::render('Produit/ProduitManager', [
            'produits' => Produit::with(['categorie', 'stocks.rayon'])->get(),
            'categories' => Categorie::all(),
            'rayons' => Rayon::all(),
            'prixProduits' => PrixProduit::orderBy('date_effet', 'desc')->get(),
            'stocks' => Stock::with('rayon')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:produits',
            'nom' => 'required',
            'categorie_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'taux_tva' => 'nullable|numeric|min:0|max:100'
        ]);

        $data = $request->except('image');
        $data['tva_applicable'] = $request->has('tva_applicable');
        $data['actif'] = $request->has('actif');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $produit = Produit::create($data);

        // Si les informations de prix sont fournies, créer un prix initial
        if ($request->filled('prix_detail')) {
            PrixProduit::create([
                'produit_id' => $produit->id,
                'prix_detail' => $request->prix_detail,
                'quantite_semi_gros' => $request->quantite_semi_gros ?? 4,
                'prix_semi_gros' => $request->prix_semi_gros ?? $request->prix_detail,
                'quantite_gros' => $request->quantite_gros ?? 10,
                'prix_gros' => $request->prix_gros ?? $request->prix_detail,
                'prix_achat' => $request->prix_achat ?? 0,
                'marge' => $request->marge ?? ($request->prix_detail - ($request->prix_achat ?? 0)),
                'date_effet' => now(),
            ]);
        }

        // Initialiser les stocks si demandé
        if ($request->filled('stock_initial') && $request->stock_initial > 0) {
            $stock = Stock::create([
                'produit_id' => $produit->id,
                'rayon_id' => $request->rayon_id,
                'quantite' => $request->stock_initial,
                'quantite_alerte' => $request->quantite_alerte ?? 10
            ]);

            // Enregistrer le mouvement de stock initial
            StockMouvement::create([
                'produit_id' => $produit->id,
                'rayon_id' => $request->rayon_id,
                'quantity' => $request->stock_initial,
                'type' => 'entree',
                'motif' => 'Stock initial',
                'user_id' => auth()->id()
            ]);
        }

        return redirect()->back()->with('success', 'Produit créé avec succès');
    }

    public function update(Request $request, Produit $produit)
    {
        $request->validate([
            'code' => 'required|unique:produits,code,' . $produit->id,
            'nom' => 'required',
            'categorie_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'taux_tva' => 'nullable|numeric|min:0|max:100'
        ]);

        $data = $request->except('image');
        $data['tva_applicable'] = $request->has('tva_applicable');
        $data['actif'] = $request->has('actif');

        if ($request->hasFile('image')) {
            if ($produit->image) {
                Storage::disk('public')->delete($produit->image);
            }
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $produit->update($data);

        return redirect()->back()->with('success', 'Produit mis à jour avec succès');
    }

    public function destroy(Produit $produit)
    {
        if ($produit->image) {
            Storage::disk('public')->delete($produit->image);
        }
        
        $produit->delete();
        
        return redirect()->back()->with('success', 'Produit supprimé avec succès');
    }
}
