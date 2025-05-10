<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CategoryRequest;
use App\Models\Categorie;
use Inertia\Inertia;

class CategorieController extends Controller
{
    public function index()
    {
        $categories = Categorie::withCount('produits')
            ->orderBy('produits_count', 'desc')
            ->get();
        
        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'stats' => [
                'total_categories' => $categories->count(),
                'total_produits' => $categories->sum('produits_count'),
                'moyenne_produits' => $categories->avg('produits_count'),
                'categorie_plus_utilisee' => $categories->first()?->name,
                'produits_categorie_plus_utilisee' => $categories->first()?->produits_count,
            ]
        ]);
    }

    public function store(CategoryRequest $request)
    {
        Categorie::create($request->validated());

        return redirect()->back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Catégorie créée avec succès'
            ]);
    }

    public function update(CategoryRequest $request, Categorie $category)
    {
        $category->update($request->validated());

        return redirect()->back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Catégorie mise à jour avec succès'
            ]);
    }

    public function destroy(Categorie $category)
    {
        if ($category->produits()->exists()) {
            return redirect()->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Impossible de supprimer: cette catégorie contient des produits'
                ]);
        }

        $category->delete();

        return redirect()->back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Catégorie supprimée avec succès'
            ]);
    }
}
