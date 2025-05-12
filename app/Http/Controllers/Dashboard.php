<?php

namespace App\Http\Controllers;

use App\Models\ArticleVente;
use App\Models\Caisse;
use App\Models\CaisseMouvement;
use App\Models\Client;
use App\Models\Stock;
use App\Models\StockMouvement;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class Dashboard extends Controller
{
    /*
    0 => array:4 [▼
    "type" => "caisse"
    "description" => "Mouvement de caisse: coco (233333333 Franc Congolais)"
    "user" => "Mr. Ramon Abshire IV de"
    "date" => 
Illuminate\Support
\
Carbon @1746918449
 {#1452 ▶}
  ]*/
    public function index (){
       
        return Inertia::render('Dashboard', [
            'stats' => [
                'today_sales' => Vente::today()->sum('total_ttc'),
                'sales_change' => $this->calculateSalesChange(),
                'today_transactions' => Vente::today()->count(),
                'transactions_change' => $this->calculateTransactionsChange(),
                'low_stock_items' => Stock::whereColumn('quantite', '<=', 'quantite_alerte')->count(),
                'today_profit' => $this->calculateTodayProfit(),
                'profit_change' => $this->calculateProfitChange(),
            ],
            'recentSales' => Vente::with('client')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($v) => [
                    'code' => $v->code,
                    'total_ttc' => $v->total_ttc,
                    'client_name' => $v->client->name ?? null,
                    'created_at' => $v->created_at,
                ]),
            'topProducts' => ArticleVente::with('produit')
                ->selectRaw('produit_id, sum(quantite) as quantity, sum(montant_ttc) as revenue')
                ->whereDate('created_at', today())
                ->groupBy('produit_id')
                ->orderByDesc('revenue')
                ->take(5)
                ->get()
                ->map(fn($a) => [
                    'name' => $a->produit->nom,
                    'image' => $a->produit->image,
                    'quantity' => $a->quantity,
                    'revenue' => $a->revenue,
                ]),
            'bestCustomers' => Client::withCount(['ventes as purchases'])
                ->withSum('ventes as total_spent', 'total_ttc')
                ->orderByDesc('total_spent')
                ->take(5)
                ->get()
                ->map(fn($c) => [
                    'name' => $c->name,
                    'purchases' => $c->purchases,
                    'total_spent' => $c->total_spent,
                ]),
            'stockAlerts' => Stock::with(['produit', 'rayon'])
                ->whereColumn('quantite', '<=', 'quantite_alerte')
                ->get()
                ->map(fn($s) => [
                    'product_name' => $s->produit->nom,
                    'rayon_name' => $s->rayon->nom,
                    'current_quantity' => $s->quantite,
                ]),
            'cashierStatus' => Caisse::with('devise')
                ->get()
                ->map(fn($c) => [
                    'name' => $c->name,
                    'is_active' => $c->is_active,
                    'opened_at' => $c->opened_at?->format('H:i'),
                    'solde_actuel' => $c->solde_actuel,
                    'devise_code' => $c->devise->code,
                ]),
            'salesTrend' => [
                '7days' => $this->getSalesTrend(7),
                '30days' => $this->getSalesTrend(30),
                'year' => $this->getSalesTrend(365),
            ],
            'recentActivities' => $this->getRecentActivities(),
        ]);
    }

    /**
     * Calcule le pourcentage de changement des ventes entre aujourd'hui et hier
     */
    protected function calculateSalesChange(): float
    {
        $todaySales = Vente::today()->sum('total_ttc');
        $yesterdaySales = Vente::whereDate('created_at', today()->subDay())->sum('total_ttc');

        if ($yesterdaySales == 0) {
            return $todaySales > 0 ? 100 : 0;
        }

        return round(($todaySales - $yesterdaySales) / $yesterdaySales * 100, 2);
    }

    /**
     * Calcule le pourcentage de changement du nombre de transactions entre aujourd'hui et hier
     */
    protected function calculateTransactionsChange(): float
    {
        $todayTransactions = Vente::today()->count();
        $yesterdayTransactions = Vente::whereDate('created_at', today()->subDay())->count();

        if ($yesterdayTransactions == 0) {
            return $todayTransactions > 0 ? 100 : 0;
        }

        return round(($todayTransactions - $yesterdayTransactions) / $yesterdayTransactions * 100, 2);
    }

    /**
     * Calcule le profit d'aujourd'hui (total_ttc - (quantité * prix_achat))
     */
    protected function calculateTodayProfit(): float
    {
        $todayProfit = DB::table('articles_vente')
            ->join('prix_produits', function($join) {
                $join->on('articles_vente.produit_id', '=', 'prix_produits.produit_id')
                    ->where('prix_produits.date_effet', '<=', now())
                    ->where(function($query) {
                        $query->whereNull('prix_produits.date_fin')
                              ->orWhere('prix_produits.date_fin', '>=', now());
                    });
            })
            ->whereDate('articles_vente.created_at', today())
            ->selectRaw('SUM((articles_vente.prix_unitaire - prix_produits.prix_achat) * articles_vente.quantite) as profit')
            ->value('profit');
    
        return $todayProfit ?? 0;
    }
    /**
     * Calcule le pourcentage de changement du profit entre aujourd'hui et hier
     */
    protected function calculateProfitChange(): float
{
    $todayProfit = $this->calculateTodayProfit();

    $yesterdayProfit = DB::table('articles_vente')
        ->join('prix_produits', function($join) {
            $join->on('articles_vente.produit_id', '=', 'prix_produits.produit_id')
                ->where('prix_produits.date_effet', '<=', now()->subDay())
                ->where(function($query) {
                    $query->whereNull('prix_produits.date_fin')
                          ->orWhere('prix_produits.date_fin', '>=', now()->subDay());
                });
        })
        ->whereDate('articles_vente.created_at', today()->subDay())
        ->selectRaw('SUM((articles_vente.prix_unitaire - prix_produits.prix_achat) * articles_vente.quantite) AS profit')
        ->value('profit');

    if ($yesterdayProfit == 0) {
        return $todayProfit > 0 ? 100 : 0;
    }

    return round(($todayProfit - $yesterdayProfit) / $yesterdayProfit * 100, 2);
}


    /**
     * Récupère la tendance des ventes sur une période donnée
     */
    protected function getSalesTrend(int $days): array
    {
        $startDate = now()->subDays($days)->startOfDay();
        $endDate = now()->endOfDay();

        $sales = Vente::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_ttc) as total')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Remplir les jours manquants avec 0
        $result = [];
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $dateString = $currentDate->toDateString();
            $sale = $sales->firstWhere('date', $dateString);
            
            $result[] = [
                'date' => $dateString,
                'total' => $sale ? $sale->total : 0,
            ];
            
            $currentDate->addDay();
        }

        return $result;
    }

    /**
     * Récupère les activités récentes (mouvements de stock et de caisse)
     */
    protected function getRecentActivities(): array
    {
        $stockActivities = StockMouvement::with(['produit', 'user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($m) {
                return [
                    'type' => 'stock',
                    'description' => "Mouvement de stock: {$m->produit->nom} ({$m->quantity} unités)",
                    'user' => $m->user->name,
                    'date' => $m->created_at->diffForHumans(),
                    'color'=>"primary"
                ];
            });

        $cashActivities = CaisseMouvement::with(['caisse', 'user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($m) {
                return [
                    'type' => 'caisse',
                    'description' => "Mouvement de caisse: {$m->caisse->name} ({$m->montant} {$m->caisse->devise->code})",
                    'user' => $m->user->name,
                    'date' => $m->created_at->diffForHumans(),
                    'color'=>"secondary"

                ];
            });
            
        return $stockActivities->merge($cashActivities)
            ->sortByDesc('date')
            ->take(5)
            ->values()
            ->all();
    }
}

