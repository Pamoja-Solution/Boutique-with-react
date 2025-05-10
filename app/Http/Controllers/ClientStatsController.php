<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Vente;
use App\Models\ArticleVente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ClientStatsController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->input('period', 'month');
        $clientType = $request->input('type', 'all');
        
        // Calcul des dates
        $now = Carbon::now();
        $startDate = match($period) {
            'day' => $now->startOfDay(),
            'week' => $now->startOfWeek(),
            'month' => $now->startOfMonth(),
            'year' => $now->startOfYear(),
            default => $now->subMonth()->startOfDay(),
        };

        // Requête de base
        $query = Client::query();
        
        // Filtre par type de client
        if ($clientType !== 'all') {
            $query->where('type', $clientType);
        }

        // Statistiques principales
        $stats = [
            'total_clients' => $query->clone()->count(),
            'total_ventes' => Vente::where('created_at', '>=', $startDate)->count(),
            'chiffre_affaires' => Vente::where('created_at', '>=', $startDate)->sum('total_ttc'),
            'clients_actifs' => Vente::where('created_at', '>=', $startDate)
                ->distinct('client_id')
                ->count('client_id'),
            'top_clients' => Vente::selectRaw('client_id, COUNT(*) as total_ventes, SUM(total_ttc) as total_ttc')
                ->with('client')
                ->where('created_at', '>=', $startDate)
                ->groupBy('client_id')
                ->orderByDesc('total_ttc')
                ->limit(5)
                ->get(),
            'ventes_par_type' => Client::selectRaw('type, COUNT(*) as total_clients, 
                (SELECT SUM(total_ttc) FROM ventes WHERE ventes.client_id = clients.id AND ventes.created_at >= ?) as total_ttc', 
                [$startDate])
                ->groupBy('type')
                ->get(),
        ];

        // Données pour les graphiques
        $chartData = Vente::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(total_ttc) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Clients/Stats', [
            'stats' => $stats,
            'chartData' => $chartData,
            'period' => $period,
            'clientType' => $clientType,
        ]);
    }

    public function show(Client $client)
    {
        // Statistiques spécifiques au client
        $stats = [
            'total_ventes' => $client->ventes()->count(),
            'total_ttc' => $client->ventes()->sum('total_ttc'),
            'moyenne_vente' => $client->ventes()->avg('total_ttc'),
            'dernieres_ventes' => $client->ventes()
                ->with('user')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(),
            'produits_frequents' => ArticleVente::selectRaw('produit_id, sum(quantite) as total_quantite, sum(montant_ttc) as total_ttc')
                ->with('produit')
                ->whereHas('vente', function($q) use ($client) {
                    $q->where('client_id', $client->id);
                })
                ->groupBy('produit_id')
                ->orderByDesc('total_quantite')
                ->limit(5)
                ->get(),
        ];

        return Inertia::render('Clients/ShowStats', [
            'client' => $client,
            'stats' => $stats,
        ]);
    }
}