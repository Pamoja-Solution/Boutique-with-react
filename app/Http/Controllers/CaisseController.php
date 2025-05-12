<?php

namespace App\Http\Controllers;

use App\Models\Caisse;
use App\Models\Devise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CaisseController extends Controller
{
    public function index()
    {
        return Inertia::render('Caisse/Index', [
            'caisses' => Caisse::with('devise')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Caisse/Create', [
            'devises' => Devise::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'solde_initial' => 'required|numeric|min:0',
            'devise_id' => 'required|exists:devises,id',
        ]);

        $caisse = Caisse::create([
            'name' => $request->name,
            'solde_initial' => $request->solde_initial,
            'solde_actuel' => $request->solde_initial,
            'devise_id' => $request->devise_id,
            'is_active' => true,
        ]);

        return redirect()->route('caisses.index')->with('success', 'Caisse créée avec succès');
    }

    public function edit( $caisse)
    {
        $caisse = Caisse::findorFail($caisse)->take(1)->get();
       //dd($caisse);
        return Inertia::render('Caisse/Edit', [
            'caisse' => $caisse,
            'devises' => Devise::all(),
        ]);
    }

    public function update(Request $request,  $caisse)
    {
        $caisse = Caisse::findorFail($caisse)->first();
        //dd($caisse);
        $request->validate([
            'name' => 'required|string|max:255',
            'devise_id' => 'required|exists:devises,id',
        ]);

        $caisse->update([
            'name' => $request->name,
            'devise_id' => $request->devise_id,
        ]);

        //return redirect()->route('caisses.index')->with('success', 'Caisse mise à jour avec succès');
        return back()->with('success', 'Caisse mise à jour avec succès');
    }

    public function destroy(Caisse $caisse)
    {
        if ($caisse->is_active) {
            return back()->with('error', 'Impossible de supprimer une caisse active');
        }

        $caisse->delete();
        return redirect()->route('caisses.index')->with('success', 'Caisse supprimée avec succès');
    }

    public function toggleStatus(Caisse $caisse)
    {
        $caisse->update(['is_active' => !$caisse->is_active]);
        $action = $caisse->is_active ? 'ouverte' : 'fermée';
        return back()->with('success', "Caisse {$action} avec succès");
    }

    

    public function switch(Caisse $caisse)
    {
        // Désactiver toutes les caisses
        Caisse::where('is_active', true)->update(['is_active' => false]);
        
        // Activer la caisse sélectionnée
        $caisse->update(['is_active' => true]);
        
        return redirect()->back()->with('success', 'Caisse changée avec succès');
    }

    public function close(Caisse $caisse)
    {
        $caisse->update(['is_active' => false]);
        
        return redirect()->back()->with('success', 'Caisse fermée avec succès');
    }
    
    // Méthodes supplémentaires pour le CRUD complet
    
}