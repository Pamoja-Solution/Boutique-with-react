<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use App\Models\User;
use App\Models\Role;
use App\Models\Stock;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rules;

use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', User::class);
        //dd(User::with('role')->latest()->get(),);
        return Inertia::render('Users/Index', [
            'users' => User::with('role')->latest()->get(),
            'roles' => Role::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role_id' => 'nullable|exists:roles,id',
            'photo' => 'nullable|image|max:2048',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
        ]);

        if ($request->hasFile('photo')) {
            $user->update([
                'photo' => $request->file('photo')->store('users', 'public'),
            ]);
        }

        return redirect()->back()->with('success', 'Utilisateur créé avec succès');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],

            'role_id' => 'nullable|exists:roles,id',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
        ];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('users', 'public');
        }

        $user->update($data);

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès');
    }

    public function restore($id)
    {
        $user = User::findOrFail($id);
        Gate::authorize('viewAny', User::class);

        $user->activate();

        return redirect()->back()
            ->with('success', 'Utilisateur réactivé avec succès');
    }
    public function show(User $user)
    {
        // Afficher un utilisateur
        return view('users.show', compact('user'));
    }

    // Dans le contrôleur
    public function userStats(Request $request)
    {
        // Dates par défaut (aujourd'hui)
        $today = now()->format('Y-m-d');
        $dateDebut = $request->input('dateDebut', $today);
        $dateFin = $request->input('dateFin', $today);

        // Requête pour les ventes
        $ventes = Vente::with(['client', 'articles_vente.produit.categorie', 'articles_vente.rayon'])
            ->where('user_id', auth()->id())
            ->whereBetween('created_at', [$dateDebut . ' 00:00:00', $dateFin . ' 23:59:59'])
            ->when($request->has('statut') && $request->statut !== 'tous', fn($q) => $q->where('statut', $request->statut))
            ->when($request->has('search'), fn($q) => $q->where(function($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                ->orWhereHas('client', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
            }))
            ->orderBy('created_at', 'desc')
            ->get();

        // Requête pour les dépenses
        $depenses = Depense::where('user_id', auth()->id())
            ->whereBetween('date_depense', [$dateDebut, $dateFin])
            ->orderBy('date_depense', 'desc')
            ->get();

        // Requête pour les stocks (si nécessaire)
        $stocks = Stock::with(['produit.categorie','produit.prix', 'rayon'])
            ->whereHas('produit', fn($q) => $q->where('actif', true))
            ->orderBy('quantite')
            ->get();

            $valeurStock = Stock::with(['produit', 'prixProduit' => function($query) {
                $query->latest('date_effet')->first();
            }])->get()->sum(function($stock) {
                $qte = $stock->quantite ?? 0;
                $prix = $stock->prixProduit->prix_detail ?? 0;
                
                if ($stock->prixProduit) {
                    if ($qte >= $stock->prixProduit->quantite_gros) {
                        $prix = $stock->prixProduit->prix_gros;
                    } elseif ($qte >= $stock->prixProduit->quantite_semi_gros) {
                        $prix = $stock->prixProduit->prix_semi_gros;
                    }
                }
                
                return $qte * $prix;
            });
        // Calcul des stats globales
        $statsGlobales = [
            // Ventes
            'totalVentes' => $ventes->count(),
            'totalHT' => $ventes->sum('total_ht'),
            'totalTVA' => $ventes->sum('total_tva'),
            'totalTTC' => $ventes->sum('total_ttc'),
            'totalRemise' => $ventes->sum('montant_remise'),
            'produitsVendus' => $ventes->sum(fn($v) => $v->articles_vente->sum('quantite')),
            
            // Dépenses
            'totalDepenses' => $depenses->sum('montant_converti'),
            'moyenneDepenses' => $depenses->avg('montant_converti') ?? 0,
            
            // Stocks
            'totalProduitsStock' => $stocks->count(),
            'produitsEnAlerte' => $stocks->where('quantite', '<=', DB::raw('quantite_alerte'))->count(),
            'valeurTotaleStock' => $stocks->sum(fn($s) => $s->quantite * ($s->produit->prix_unitaire ?? 0))
        ];

        return Inertia::render('Users/UserStats', [
            'ventes' => $ventes,
            'depenses' => $depenses,
            'stocks' => $stocks,
            "valeurStock"=>$valeurStock,
            'statsGlobales' => $statsGlobales,
            'filters' => $request->only(['dateDebut', 'dateFin', 'statut', 'search'])
        ]);
    }
}