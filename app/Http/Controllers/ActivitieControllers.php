<?php

namespace App\Http\Controllers;

use App\Models\CaisseMouvement;
use App\Models\StockMouvement;
use App\Models\Vente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivitieControllers extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ventes = Vente::with(['client', 'articles.produit'])
        ->latest()
        ->get()
        ->map(function ($vente) {
            return [
                'id' => $vente->id,
                'montant_total' => $vente->montant_total,
                'statut' => $vente->statut,
                'created_at' => $vente->created_at,
                'client' => $vente->client,
                'articles' => $vente->articles->map(function ($article) {
                    return [
                        'id' => $article->id,
                        'quantite' => $article->quantite,
                        'prix_unitaire' => $article->prix_unitaire,
                        'produit' => $article->produit->only('id', 'nom'),
                    ];
                }),
            ];
        });

        return Inertia('Activites/Index',[
            "recents"=>$this->getRecentActivities(),
            'ventes' => $ventes,
            'devise' => '€', // Ou config('app.currency')
        ]);
    }

    protected function getRecentActivities(): array
{
    // Activités de stock
    $stockActivities = StockMouvement::with(['produit', 'user'])
        ->latest()
        ->take(15)
        ->get()
        ->map(function($m) {
            return [
                'type' => "mouvement",
                'description' => "Mouvement de stock: {$m->produit->nom} ({$m->quantity} unités)",
                'user' => $m->user->name,
                'date' => $m->created_at->diffForHumans(),
                'color' => "info"
            ];
        });

    // Activités de ventes (ventes globales)
    $ventesActivities = Vente::with(['user','client'])
        ->latest()
        ->take(15)
        ->get()
        ->map(function($vente) {
            return [
                'id' => $vente->id,
                'type' => 'vente',
                "client"=>$vente->client,
                'description' => "Vente #{$vente->code} - Montant: {$vente->total_ttc} FC",
                'user' => $vente->user->name,
                'date' => $vente->created_at->diffForHumans(),
                'color' => "success"
            ];
        });


    // Détails des articles vendus
    $detailsVentes = Vente::with(['articles.produit', 'user'])
        ->latest()
        ->take(15)
        ->get()
        ->map(function($vente) {
            return $vente->articles->map(function($article) use ($vente) {
                return [
                    'id' => $article->id,
                    'type' => 'detail_vente',
                    'description' => "Article vendu: {$article->produit->nom} ({$article->quantite} × {$article->prix_unitaire})",
                    'user' => $vente->user->name,
                    'date' => $vente->created_at->diffForHumans(),
                    'color' => "primary"
                ];
            });
        })
        ->flatten();

    // Activités de caisse
    $cashActivities = CaisseMouvement::with(['caisse', 'user'])
        ->latest()
        ->take(15)
        ->get()
        ->map(function($m) {
            return [
                'id' => $m->id,
                'type' => 'caisse',
                'description' => "Mouvement de caisse: {$m->caisse->name} ({$m->montant} {$m->caisse->devise->code})",
                'user' => $m->user->name,
                'date' => $m->created_at->diffForHumans(),
                'color' => "secondary"
            ];
        });

    // Fusionner toutes les activités
    $allActivities = $stockActivities
        ->merge($ventesActivities)
        ->merge($detailsVentes)
        ->merge($cashActivities)
        ->sortByDesc('date')
        ->take(25)
        ->values();
    // Retourner en tableau pur
    return $allActivities->all();
}
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
