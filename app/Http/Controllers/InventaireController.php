<?php

namespace App\Http\Controllers;

use App\Models\Inventaire;
use App\Models\InventaireItem;
use App\Models\Produit;
use App\Models\Rayon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventaires = Inventaire::withCount('items')
            ->withSum('items as ecart_total', 'ecart')
            ->orderBy('date_inventaire', 'desc')
            ->get();
        
        $stats = [
            'total_inventaires' => Inventaire::count(),
            'inventaires_termines' => Inventaire::where('statut', 'termine')->count(),
            'inventaires_encours' => Inventaire::where('statut', 'encours')->count(),
            'ecart_total' => InventaireItem::sum('ecart'),
        ];
        
        return Inertia::render('Inventaires/Index', [
            'inventaires' => $inventaires,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Si vous avez une page de création séparée
        return Inertia::render('Inventaires/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:255|unique:inventaires,reference',
            'date_inventaire' => 'required|date',
            'notes' => 'nullable|string',
        ]);
        
        $inventaire = new Inventaire();
        $inventaire->reference = $validated['reference'];
        $inventaire->date_inventaire = $validated['date_inventaire'];
        $inventaire->notes = $validated['notes'] ?? null;
        $inventaire->statut = 'planifie';
        $inventaire->user_id = auth()->id();
        $inventaire->save();
        
        return redirect()->route('inventaires.index')
            ->with('success', 'Inventaire créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventaire $inventaire)
    {
        $inventaire->load([
            'items.produit', 
            'items.rayon',
            'user'
        ]);
        
        $produits = Produit::where('actif', true)
            ->orderBy('nom')
            ->get();
            
        $rayons = Rayon::orderBy('nom')
            ->get();
            
        return Inertia::render('Inventaires/Show', [
            'inventaire' => $inventaire,
            'produits' => $produits,
            'rayons' => $rayons,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inventaire $inventaire)
    {
        // Si vous avez une page d'édition séparée
        return Inertia::render('Inventaires/Edit', [
            'inventaire' => $inventaire,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventaire $inventaire)
    {
        // Vérification que l'inventaire est toujours modifiable
        if (!in_array($inventaire->statut, ['planifie'])) {
            return redirect()->back()
                ->with('error', "Impossible de modifier un inventaire qui n'est pas en statut 'planifié'.");
        }
        
        $validated = $request->validate([
            'reference' => 'required|string|max:255|unique:inventaires,reference,' . $inventaire->id,
            'date_inventaire' => 'required|date',
            'notes' => 'nullable|string',
        ]);
        
        $inventaire->reference = $validated['reference'];
        $inventaire->date_inventaire = $validated['date_inventaire'];
        $inventaire->notes = $validated['notes'] ?? null;
        $inventaire->save();
        
        return redirect()->back()
            ->with('success', 'Inventaire modifié avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventaire $inventaire)
    {
        // Vérification que l'inventaire est supprimable
        if (!in_array($inventaire->statut, ['planifie'])) {
            return redirect()->back()
                ->with('error', "Impossible de supprimer un inventaire qui n'est pas en statut 'planifié'.");
        }
        
        $inventaire->delete();
        
        return redirect()->route('inventaires.index')
            ->with('success', 'Inventaire supprimé avec succès.');
    }
    
    /**
     * Changer le statut d'un inventaire
     */
    public function updateStatus(Request $request, Inventaire $inventaire)
    {
        $validated = $request->validate([
            'statut' => 'required|in:planifie,encours,termine,annule',
        ]);
        
        // Vérification de la transition d'état valide
        $transitions = [
            'planifie' => ['encours', 'annule'],
            'encours' => ['termine', 'annule'],
            'termine' => [],
            'annule' => [],
        ];
        
        if (!in_array($validated['statut'], $transitions[$inventaire->statut])) {
            return redirect()->back()
                ->with('error', 'Transition de statut non autorisée.');
        }
        
        $inventaire->statut = $validated['statut'];
        $inventaire->save();
        
        return redirect()->back()
            ->with('success', 'Statut de l\'inventaire mis à jour.');
    }
    
    /**
     * Exporter l'inventaire au format PDF
     */
    public function exportPdf(Inventaire $inventaire)
    {
        $inventaire->load(['items.produit', 'items.rayon', 'user']);
        
        // Ici, vous utiliseriez une bibliothèque comme dompdf, mPDF, ou Snappy
        // pour générer votre PDF et le retourner en réponse.
        
        // Exemple avec dompdf (après avoir installé barryvdh/laravel-dompdf):
        // $pdf = PDF::loadView('pdf.inventaire', ['inventaire' => $inventaire]);
        // return $pdf->download('inventaire-' . $inventaire->reference . '.pdf');
        
        // Pour cet exemple, nous retournerons simplement une redirection
        return redirect()->back()
            ->with('info', 'La fonctionnalité d\'export PDF sera bientôt disponible.');
    }
}