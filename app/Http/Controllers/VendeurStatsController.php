<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendeurStatsController extends Controller
{
    public function index(Request $request)
    {
        $vendeurs = User::all();
        
        // Récupérer le vendeur sélectionné (si présent dans la requête)
        $selectedVendeur = $request->has('vendeur_id') 
            ? User::find($request->vendeur_id)
            : null;
        
        // Initialiser les variables pour les ventes et stats
        $ventes = collect();
        $stats = null;
        
        // Si un vendeur est sélectionné, charger ses ventes
        if ($selectedVendeur) {
            $query = Vente::with(['client', 'articles.produit'])
                ->where('user_id', $selectedVendeur->id)
                ->where('statut', 'terminee');
            
            // Appliquer les filtres de période
            if ($request->periode) {
                switch ($request->periode) {
                    case 'today':
                        $query->whereDate('created_at', today());
                        break;
                    case 'yesterday':
                        $query->whereDate('created_at', today()->subDay());
                        break;
                    case 'month':
                        $query->whereMonth('created_at', now()->month)
                              ->whereYear('created_at', now()->year);
                        break;
                    case 'custom':
                        if ($request->date_debut && $request->date_fin) {
                            $query->whereBetween('created_at', [
                                $request->date_debut . ' 00:00:00',
                                $request->date_fin . ' 23:59:59'
                            ]);
                        }
                        break;
                }
            }
            
            $ventes = $query->orderBy('created_at', 'desc')->get();
            
            // Calculer les stats
            $stats = [
                'total_ventes' => $ventes->count(),
                'total_ttc' => $ventes->sum('total_ttc'),
                'total_tva' => $ventes->sum('total_tva'),
                'total_ht' => $ventes->sum('total_ht'),
            ];
        }
        
        return Inertia::render('Stats/Vendeurs', [
            'vendeurs' => $vendeurs,
            'selectedVendeur' => $selectedVendeur,
            'ventes' => $ventes,
            'stats' => $stats,
            'filters' => $request->only(['periode', 'date_debut', 'date_fin', 'vendeur_id'])
        ]);
    }
}