<?php

namespace Database\Seeders;

use App\Models\ArticleVente;
use App\Models\Categorie;
use App\Models\Client;
use App\Models\PrixProduit;
use App\Models\Produit;
use App\Models\Rayon;
use App\Models\Role;
use App\Models\Stock;
use App\Models\User;
use App\Models\Vente;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Role::factory(4)->create();
        Categorie::factory()->count(8)->create();
        Rayon::factory(8)->create();
        Produit::factory()->count(50)->create();
        PrixProduit::factory()->count(50)->create();
        //Stock::factory()->count(50)->create();
        //Client::factory()->count(150)->create();
        //Vente::factory()->count(150)->create();
        //ArticleVente::factory()->count(150)->create();
        //PrixProduit::factory()->count(150)->create();
        
    }
}
