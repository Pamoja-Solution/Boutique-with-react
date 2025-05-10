<?php

namespace App\Http\Controllers;

use App\Models\Rayon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RayonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rayons = Rayon::withCount('inventaireItems')
            ->orderBy('nom')
            ->get();
        
        return Inertia::render('Rayons/Index', [
            'rayons' => $rayons,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Rayons/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code_emplacement' => 'required|string|max:255|unique:rayons,code_emplacement',
            'description' => 'nullable|string',
        ]);
        
        $rayon = new Rayon();
        $rayon->nom = $validated['nom'];
        $rayon->code_emplacement = $validated['code_emplacement'];
        $rayon->description = $validated['description'] ?? null;
        $rayon->save();
        
        return redirect()->route('rayons.index')
            ->with('success', 'Rayon créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Rayon $rayon)
    {
        $rayon->load('inventaireItems.inventaire', 'inventaireItems.produit');
        
        return Inertia::render('Rayons/Show', [
            'rayon' => $rayon,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rayon $rayon)
    {
        return Inertia::render('Rayons/Edit', [
            'rayon' => $rayon,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rayon $rayon)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code_emplacement' => 'required|string|max:255|unique:rayons,code_emplacement,' . $rayon->id,
            'description' => 'nullable|string',
        ]);
        
        $rayon->nom = $validated['nom'];
        $rayon->code_emplacement = $validated['code_emplacement'];
        $rayon->description = $validated['description'] ?? null;
        $rayon->save();
        
        return redirect()->route('rayons.index')
            ->with('success', 'Rayon modifié avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rayon $rayon)
    {
        // Vérification que le rayon n'est pas utilisé dans des items d'inventaire
        if ($rayon->inventaireItems()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer un rayon utilisé dans des inventaires.');
        }
        
        $rayon->delete();
        
        return redirect()->route('rayons.index')
            ->with('success', 'Rayon supprimé avec succès.');
    }
}