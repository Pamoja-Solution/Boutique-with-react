#!/bin/bash

# Modèles et migrations
php artisan make:model Role -m 
php artisan make:model User -m 
php artisan make:model Client -m 
php artisan make:model Categorie -m 
php artisan make:model Rayon -m 
php artisan make:model Produit -m 
php artisan make:model PrixProduit -m 
php artisan make:model Stock -m 
php artisan make:model StockMouvement -m 
php artisan make:model Vente -m 
php artisan make:model ArticleVente -m 
php artisan make:model Paiement -m 
php artisan make:model Devise -m 
php artisan make:model TauxEchange -m 
php artisan make:model Depense -m 
php artisan make:model Caisse -m 
php artisan make:model CaisseMouvement -m 
php artisan make:model Inventaire -m 
php artisan make:model InventaireItem -m 
php artisan make:model StatistiqueJournaliere -m 

# Contrôleurs Inertia (ressource ou simple)
php artisan make:controller Admin/RoleController -r --invokable 
php artisan make:controller Admin/UserController -r
php artisan make:controller ClientController -r
php artisan make:controller CategorieController -r
php artisan make:controller RayonController -r
php artisan make:controller ProduitController -r
php artisan make:controller StockController -r
php artisan make:controller VenteController -r
php artisan make:controller PaiementController -r
php artisan make:controller DeviseController -r
php artisan make:controller DepenseController -r
php artisan make:controller CaisseController -r
php artisan make:controller InventaireController -r
php artisan make:controller StatistiqueController -r
php artisan make:controller PointDeVenteController -r
 
# Middlewares 
php artisan make:middleware CheckRole 
php artisan make:middleware CheckCaisseOuverte 
php artisan make:middleware CheckStock 

# Exécuter les migrations
php artisan migrate:fresh --seed

# Installer les dépendances frontend
#npm install
#npm run dev