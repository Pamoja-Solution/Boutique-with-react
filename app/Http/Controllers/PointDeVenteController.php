<?php
namespace App\Http\Controllers;

use App\Events\VenteCompleted;
use App\Models\{Produit, Client, Vente, ArticleVente, Stock, Rayon};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;


class PointDeVenteController extends Controller
{
    /**
     * Affiche l'interface du point de vente
     */
    public function index()
    {
        
        return Inertia::render('PointDeVente/Index', [
            'rayons' => Rayon::select('id', 'nom', 'categorie_id')
                ->with(['categorie:id,nom'])
                ->orderBy('nom')
                ->get(),
            'clientsInitiaux' => Client::select('id', 'name', 'phone', 'email')
                ->orderBy('name')
                ->limit(10)
                ->get(),
        ]);
    }

    /**
     * Recherche de produits par nom ou code
     */
    public function searchProduits(Request $request)
    {
        $search = $request->input('search', '');
        
        if (strlen($search) < 3) {
            return Inertia::render('PointDeVente/Index', [
                'produits' => [],
                'rayons' => Rayon::select('id', 'nom', 'categorie_id')
                    ->with(['categorie:id,nom'])
                    ->orderBy('nom')
                    ->get(),
            ]);
        }
        
        $produits = Produit::with(['prixActif', 'stocks.rayon'])
        ->where(function($query) use ($search) {
            $query->where('nom', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        })
        ->get()
        ->filter(function ($produit) {
            return $produit->prixActif && $produit->stocks->sum('quantite') > 0;
        })
        ->take(10) // ✅ après filtrage
        ->map(function ($produit) {
            $prix = $produit->prixActif;

            return [
                'id' => $produit->id,
                'nom' => $produit->nom,
                'code' => $produit->code,
                "tva_applicable"=>$produit->tva_applicable,
                'taux_tva' => $produit->taux_tva,
                'prix_detail' => $prix->prix_detail,
                'prix_semi_gros' => $prix->prix_semi_gros,
                'prix_gros' => $prix->prix_gros,
                'stock_total' => $produit->stocks->sum('quantite'),
                'rayons' => $produit->stocks
                    ->where('quantite', '>', 0)
                    ->map(function ($stock) {
                        return [
                            'id' => $stock->rayon_id,
                            'nom' => $stock->rayon->nom,
                            'quantite' => $stock->quantite
                        ];
                    })->values()
            ];
        });
//dd($produits);
        return Inertia::render('PointDeVente/Index', [
            'produits' => $produits,
            'rayons' => Rayon::select('id', 'nom', 'categorie_id')
                ->with(['categorie:id,nom'])
                ->orderBy('nom')
                ->get(),
        ]);
    }

    /**
     * Recherche de clients par nom ou téléphone
     */
    

    // Dans PointDeVenteController.php
    public function searchClients(Request $request)
    {
        $search = trim($request->input('search', ''));
        
        if (strlen($search) < 2) { // Réduit à 2 caractères minimum
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Minimum 2 caractères requis'
            ]);
        }
        
        try {
            $clients = Client::select('id', 'name', 'phone', 'email')
                ->where(function($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->orderBy('name')
                ->limit(10)
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $clients,
                'message' => $clients->isEmpty() ? 'Aucun client trouvé' : 'Clients trouvés'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Traite la soumission d'une vente
     */
    public function processVente(Request $request)
    {
        // Validation des données
        $validated = $request->validate([
            'client' => 'nullable|array',
            'client.id' => 'nullable|exists:clients,id',
            'client.name' => 'required_without:client.id|string|max:255',
            'client.phone' => 'nullable|string|max:20',
            'client.email' => 'nullable|email|max:255',
            'articles' => 'required|array|min:1',
            'articles.*.produit_id' => 'required|exists:produits,id',
            'articles.*.rayon_id' => 'required|exists:rayons,id',
            'articles.*.quantite' => 'required|integer|min:1',
            'articles.*.taux_tva' => 'required',
            'articles.*.montant_ht'=>'required|numeric|min:0',
            'articles.*.montant_tva'=>'required|numeric|min:0',
            'articles.*.montant_ttc'=>'required|numeric|min:0',
            'articles.*.prix_unitaire' => 'required|numeric|min:0',
            'articles.*.type_vente' => 'required|in:detail,semi_gros,gros',
            'montant_paye' => 'required|numeric|min:0',
            //'type_vente' => 'required|string'
            //'rayon_id'=>'required|exists:rayons,id'

        ]);
        //$validated['type_vente'] ='details';

        try {
            $vente = DB::transaction(function () use ($validated) {
                // Créer ou récupérer le client
                if (isset($validated['client']['id'])) {
                    $client = Client::findOrFail($validated['client']['id']);
                } else {
                    $client = Client::create([
                        'name' => $validated['client']['name'],
                        'phone' => $validated['client']['phone'] ?? null,
                        'email' => $validated['client']['email'] ?? null,
                    ]);
                }

                // Initialiser les totaux
                $totalHT = 0;
                $totalTVA = 0;
                $totalTTC = 0;

                // Créer la vente
                $vente = Vente::create([
                    'code' => 'V-' . date('Ymd') . '-' . Str::random(6),
                    'client_id' => $client->id,
                    'user_id' => auth()->id(),
                    'date_vente' => now(),
                    'total_ht' => 0, // Temporaire
                    'total_tva' => 0, // Temporaire
                    'total_ttc' => 0, // Temporaire
                    'montant_paye' => $validated['montant_paye'],
                    'monnaie_rendue' => 0, // Temporaire
                    'statut' => 'terminee',
                    //'type_vente' => 'detail'

                ]);

                // Initialisation des totaux
                $totalHT = 0;
                $totalTVA = 0;
                $totalTTC = 0;
                // Traiter chaque article
                foreach ($validated['articles'] as $article) {
                    $produit = Produit::with(['stocks' => function($query) {
                        $query->where('quantite', '>', 0)
                              ->orderBy('quantite', 'desc')
                              ->lockForUpdate();
                    }])->findOrFail($article['produit_id']);
                    
                    $stock = $produit->stocks->first();
                    
                    if (!$stock || $stock->quantite < $article['quantite']) {
                        throw ValidationException::withMessages([
                            'stock' => "Stock insuffisant pour {$produit->nom}"
                        ]);
                    }
    
                    // UTILISEZ LES MONTANTS ENVOYÉS PAR LE FRONTEND
                    $montantHT = $article['montant_ht'];
                    $montantTVA = $article['montant_tva'];
                    $montantTTC = $article['montant_ttc'];
    
                    ArticleVente::create([
                        'vente_id' => $vente->id,
                        'produit_id' => $produit->id,
                        'rayon_id' => $stock->rayon_id,
                        'quantite' => $article['quantite'],
                        'prix_unitaire' => $article['prix_unitaire'],
                        'taux_tva' => $article['taux_tva'],
                        'tva_applicable' => $produit->tva_applicable, // Ajout important
                        'montant_tva' => $montantTVA,
                        'montant_ht' => $montantHT,
                        'montant_ttc' => $montantTTC,
                        'type_vente' => $article['type_vente']
                    ]);
                    
                    // Mettre à jour le stock
                    $stock->decrement('quantite', $article['quantite']);
                    
                    // Mettre à jour les totaux
                    $totalHT += $montantHT;
                    $totalTVA += $montantTVA;
                    $totalTTC += $montantTTC;
                }
    
                // Mettre à jour les totaux finaux
                $vente->update([
                    'total_ht' => $totalHT,
                    'total_tva' => $totalTVA,
                    'total_ttc' => $totalTTC,
                    'monnaie_rendue' => $validated['montant_paye'] - $totalTTC
                ]);
                
                return $vente;
            });
                
            event(new VenteCompleted($vente));

            // Retourner la réponse via Inertia
            return Inertia::render('PointDeVente/Index', [
                'vente' => $vente->load('articles.produit', 'client'),
                'flash' => [
                    'message' => 'Vente enregistrée avec succès'
                ],
                
            ]);/*
            return back()->with([
                'vente' => $vente->load('articles.produit', 'client'),
                'flash' => [
                    'message' => 'Vente enregistrée avec succès'
                ]]);*/
            
        } catch (\Exception $e) {
            return Inertia::render('PointDeVente/Index', [
                'flash' => [
                    'error' => $e->getMessage()
                ]
            ]);
        }
    }

    /**
     * Générer le ticket de caisse
     */

     public function generateTicket($id)
     {
         $vente = Vente::with([
             'client', 
             'articles.produit', 
             'articles.rayon',
             'user'
         ])->findOrFail($id);
     
         // Configuration de l'entreprise avec vérification du logo
         $logoPath = config('app.logo');
         $entreprise = [
             'nom' => config('app.name'),
             'adresse' => config('app.adresse', '123 Rue du Commerce'),
             'telephone' => config('app.telephone', '+1234567890'),
             'email' => config('app.email', 'contact@example.com'),
             'site_web' => config('app.url'),
             'logo' => file_exists(public_path($logoPath)) ? $logoPath : null
         ];
     
         // Options PDF
         $pdfOptions = [
             'isRemoteEnabled' => true,
             'chroot' => public_path(),
             'defaultFont' => 'sans-serif',
             'isHtml5ParserEnabled' => true
         ];
     
         // Génération du PDF
         return Pdf::loadView('pdf.ticket', [
                 'vente' => $vente,
                 'entreprise' => $entreprise
             ])
             ->setOptions($pdfOptions)
             ->setPaper([0, 0, 226.77, 600], 'portrait')
             ->stream('ticket-'.$vente->id.'.pdf');
     }


    public function venteDetails($id)
{
    $vente = Vente::with([
        'client', 
        'articles.produit', 
        'articles.rayon',
        'user'
    ])->findOrFail($id);
    return response()->json([
        'vente' => [
            'id' => $vente->id,
            'code' => $vente->code,
            'montant_total' => $vente->total_ttc,
            'statut' => $vente->statut,
            'created_at' => $vente->created_at,
            'client' => $vente->client,
            'articles' => $vente->articles->map(function ($article) {
                return [
                    'id' => $article->id,
                    'quantite' => $article->quantite,
                    'prix_unitaire' => $article->prix_unitaire,
                    'produit' => $article->produit,
                ];
            }),
        ],
    ]);
}

    // app/Http/Controllers/VenteController.php
public function details($id)
{
    
}
}