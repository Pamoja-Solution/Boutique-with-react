<?php

namespace App\Http\Controllers;

use App\Models\Vente;
use App\Models\ArticleVente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class VenteStatsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $period = $request->input('period', 'month');
        
        // Calcul des dates en fonction de la période
        $now = Carbon::now();
        $startDate = match($period) {
            'day' => $now->startOfDay(),
            'week' => $now->startOfWeek(),
            'month' => $now->startOfMonth(),
            'year' => $now->startOfYear(),
            default => $now->subMonth()->startOfDay(),
        };

        // Statistiques principales
        $stats = [
            'total_ventes' => Vente::where('user_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'total_ttc' => Vente::where('user_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->sum('total_ttc'),
            'moyenne_vente' => Vente::where('user_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->avg('total_ttc'),
            'top_produits' => ArticleVente::selectRaw('produit_id, sum(quantite) as total_quantite, sum(montant_ttc) as total_ttc')
                ->with('produit')
                ->whereHas('vente', function($q) use ($user, $startDate) {
                    $q->where('user_id', $user->id)
                      ->where('created_at', '>=', $startDate);
                })
                ->groupBy('produit_id')
                ->orderByDesc('total_ttc')
                ->limit(5)
                ->get(),
        ];

        // Données pour les graphiques
        $chartData = Vente::where('user_id', $user->id)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(total_ttc) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Ventes/Stats', [
            'stats' => $stats,
            'chartData' => $chartData,
            'period' => $period,
        ]);
    }
}