<?php

use App\Http\Controllers\CaisseController;
use App\Http\Controllers\CaisseMouvementController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientStatsController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviseController;
use App\Http\Controllers\InventaireController;
use App\Http\Controllers\InventaireItemController;
use App\Http\Controllers\PointDeVenteController;
use App\Http\Controllers\PrixProduitController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\RayonController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StockMouvementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VenteController;
use App\Http\Controllers\VenteStatsController;
use App\Models\Categorie;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('role:admin,vendeur')->name('dashboard');
Route::middleware(['auth', 'verified'])->group(function () {
    // Produits
    Route::resource('produits', ProduitController::class);
    
    // Prix des produits
    Route::resource('prix-produits', PrixProduitController::class);
    
    // Gestion des stocks
    Route::get('stocks/{produit?}', [StockController::class, 'index'])->name('stocks.index');
    Route::post('stocks/transfert', [StockController::class, 'transfert'])->name('stocks.transfert');
    
    // Mouvements de stock
    Route::resource('stock-mouvements', StockMouvementController::class);
    Route::get('stock-mouvements/produit/{produit}', [StockMouvementController::class, 'index'])->name('stock-mouvements.produit');
    Route::get('stock-mouvements/rayon/{rayon}', [StockMouvementController::class, 'index'])->name('stock-mouvements.rayon');
});


Route::middleware(['auth', 'verified'])->group(function () {
    // Route pour afficher le gestionnaire de stocks
    Route::get('/stocks', [StockController::class, 'index'])->name('stocks.indexs');
    
    // Route pour afficher le gestionnaire de stocks pour un produit spécifique
    Route::get('/produits/{produit}/stocks', [StockController::class, 'index'])->name('produits.stocks.index');
    
    // Route pour effectuer un transfert de stock
    Route::post('/stocks/transfert', [StockController::class, 'transfert'])->name('stock.transfert');
});
Route::get('/mes-ventes/stats', [VenteStatsController::class, 'index'])->name('ventes.stats')->middleware('auth');
Route::get('/', function () {
    return inertia('Home'); // Vue d'accueil (si différente du dashboard)
})->name('home');

//Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/modal-monnaie',[DeviseController::class, 'get'])->name('currencies.get');

Route::resource('produits', ProduitController::class);
Route::post('stock-mouvements', [StockMouvementController::class, 'store']);

Route::resource('sales', VenteController::class)->only(['index']);
Route::resource('pos', PointDeVenteController::class);
Route::resource('categories', CategorieController::class);
//Route::resource('stocks', StockController::class);



Route::middleware(['auth', 'verified'])->group(function () {
    // Statistiques clients générales
    Route::get('/clients/stats', [ClientStatsController::class, 'index'])->name('clients.stats');
    
    // Statistiques pour un client spécifique
    Route::get('/clients/{client}/stats', [ClientStatsController::class, 'show'])->name('clients.stats.show');
});


// Routes pour la gestion des inventaires
Route::middleware(['auth', 'verified'])->group(function () {
    // Inventaires
    Route::resource('inventaires', InventaireController::class);
    Route::post('/inventaires/{inventaire}/status', [InventaireController::class, 'updateStatus'])->name('inventaires.status');
    Route::get('/inventaires/{inventaire}/export-pdf', [InventaireController::class, 'exportPdf'])->name('inventaires.export-pdf');
    
    // Items d'inventaire
    Route::post('/inventaires/{inventaire}/items', [InventaireItemController::class, 'store'])->name('inventaire-items.store');
    Route::put('/inventaires/{inventaire}/items/{item}', [InventaireItemController::class, 'update'])->name('inventaire-items.update');
    Route::delete('/inventaires/{inventaire}/items/{item}', [InventaireItemController::class, 'destroy'])->name('inventaire-items.destroy');
    
    // Rayons
    Route::resource('rayons', RayonController::class);
});


Route::resource('clients', ClientController::class);
Route::resource('loyalty', InventaireController::class);
Route::resource('promotions', InventaireController::class);
Route::middleware(['auth', 'verified'])->group(function () {
    // Gestion des caisses
    Route::resource('/caisses', CaisseController::class);
    // Changement de statut
    Route::post('/caisses/{caisse}/toggle-status', [CaisseController::class, 'toggleStatus'])
        ->name('caisses.toggle-status');
    Route::post('/caisses/mouvements', [CaisseController::class, 'createMouvement'])->name('caisses.mouvements.create');
    Route::post('/caisses/{caisse}/fermer', [CaisseController::class, 'fermerCaisse'])->name('caisses.fermer');

    Route::get('/caisses/{caisse}/mouvements', [CaisseMouvementController::class, 'index'])
        ->name('caisses.mouvements.index');
    Route::post('/caisses/{caisse}/mouvements', [CaisseMouvementController::class, 'store'])
        ->name('caisses.mouvements.store');
    Route::delete('/caisses/{caisse}/mouvements/{mouvement}', [CaisseMouvementController::class, 'destroy'])
        ->name('caisses.mouvements.destroy');
});

Route::resource('expenses', InventaireController::class);
Route::resource('currencies', DeviseController::class);
Route::put('currencies/restore/{id}', [DeviseController::class,'restore'])->name("currencies.restore")->middleware('can:viewAny,App\Models\User');
Route::put('currencies/desactivate/{id}',[ DeviseController::class,'desactivate'])->name("currencies.desactivate")->middleware('can:viewAny,App\Models\User');
Route::resource('reports', InventaireController::class);
Route::resource('users', UserController::class)->middleware('can:viewAny,App\Models\User');

Route::get('mes/stats', [UserController::class,'userStats'])->middleware('role:admin,vendeur,gestionnaire')->name("userStats");

Route::put('users/restore/{id}', [UserController::class,'restore'])->middleware('can:viewAny,App\Models\User')->name('users.restore');
Route::resource('settings', InventaireController::class);
Route::get('/setting', function () {
    return redirect()->route('dashboard'); // ou view('welcome') si page d'accueil
})->name('settings');

Route::get('/stocks-low', function () {
    return redirect()->route('dashboard'); // ou view('welcome') si page d'accueil
})->name('stocks.low');



Route::middleware(['auth', 'verified'])->group(function () {
    // Point de vente
    Route::get('/point-de-vente', [PointDeVenteController::class, 'index'])->name('point-de-vente');
    Route::get('/point-de-vente/search-produits', [PointDeVenteController::class, 'searchProduits'])->name('point-de-vente.search-produits');
    Route::get('/point-de-vente/search-clients', [PointDeVenteController::class, 'searchClients'])->name('point-de-vente.search-clients');
    Route::post('/point-de-vente/process', [PointDeVenteController::class, 'processVente'])->name('point-de-vente.process');
    Route::get('/ventes/{id}/ticket', [PointDeVenteController::class, 'generateTicket'])->name('ventes.ticket');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
