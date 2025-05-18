<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Vente;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VendeurStats extends Controller
{
    public function index(Request $request)
    {
       
        $now = now();
        $dbDriver = config('database.default');
        
        // Fonctions de date adaptées au driver de base de données
        if ($dbDriver === 'sqlite') {
            // Statistiques quotidiennes (SQLite)
            $ventesQuotidiennes = Vente::select([
                    'user_id',
                    DB::raw('date(created_at) as date'),
                    DB::raw('SUM(total_ttc) as total_ventes'),
                    DB::raw('COUNT(*) as nombre_ventes')
                ])
                ->where('statut', 'terminee')
                ->whereDate('created_at', $now->toDateString())
                ->groupBy('user_id', 'date')
                ->orderBy('total_ventes', 'desc')
                ->with('user')
                ->get();

            // Statistiques mensuelles (SQLite)
            $ventesMensuelles = Vente::select([
                    'user_id',
                    DB::raw('strftime("%m", created_at) as mois'),
                    DB::raw('strftime("%Y", created_at) as annee'),
                    DB::raw('SUM(total_ttc) as total_ventes'),
                    DB::raw('COUNT(*) as nombre_ventes')
                ])
                ->where('statut', 'terminee')
                ->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year)
                ->groupBy('user_id', 'mois', 'annee')
                ->orderBy('total_ventes', 'desc')
                ->with('user')
                ->get();

            // Statistiques annuelles (SQLite)
            $ventesAnnuelles = Vente::select([
                    'user_id',
                    DB::raw('strftime("%Y", created_at) as annee'),
                    DB::raw('SUM(total_ttc) as total_ventes'),
                    DB::raw('COUNT(*) as nombre_ventes')
                ])
                ->where('statut', 'terminee')
                ->whereYear('created_at', $now->year)
                ->groupBy('user_id', 'annee')
                ->orderBy('total_ventes', 'desc')
                ->with('user')
                ->get();
        } else {
            // Version MySQL/MariaDB
            // Statistiques quotidiennes
            $ventesQuotidiennes = Vente::select([
                    'user_id',
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total_ttc) as total_ventes'),
                    DB::raw('COUNT(*) as nombre_ventes')
                ])
                ->where('statut', 'terminee')
                ->whereDate('created_at', $now->toDateString())
                ->groupBy('user_id', 'date')
                ->orderBy('total_ventes', 'desc')
                ->with('user')
                ->get();

            // Statistiques mensuelles
            $ventesMensuelles = Vente::select([
                    'user_id',
                    DB::raw('MONTH(created_at) as mois'),
                    DB::raw('YEAR(created_at) as annee'),
                    DB::raw('SUM(total_ttc) as total_ventes'),
                    DB::raw('COUNT(*) as nombre_ventes')
                ])
                ->where('statut', 'terminee')
                ->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year)
                ->groupBy('user_id', 'mois', 'annee')
                ->orderBy('total_ventes', 'desc')
                ->with('user')
                ->get();

            // Statistiques annuelles
            $ventesAnnuelles = Vente::select([
                    'user_id',
                    DB::raw('YEAR(created_at) as annee'),
                    DB::raw('SUM(total_ttc) as total_ventes'),
                    DB::raw('COUNT(*) as nombre_ventes')
                ])
                ->where('statut', 'terminee')
                ->whereYear('created_at', $now->year)
                ->groupBy('user_id', 'annee')
                ->orderBy('total_ventes', 'desc')
                ->with('user')
                ->get();

                
        }
        return Inertia::render('Vendeurs/Stats', [
            'quotidiennes' => $ventesQuotidiennes,
            'mensuelles' => $ventesMensuelles,
            'annuelles' => $ventesAnnuelles,
        ]);
    }
}
