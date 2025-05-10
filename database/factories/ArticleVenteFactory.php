<?php

namespace Database\Factories;

use App\Models\ArticleVente;
use App\Models\Produit;
use App\Models\Rayon;
use App\Models\Vente;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleVenteFactory extends Factory
{
    protected $model = ArticleVente::class;

    public function definition(): array
    {
        $produit = Produit::inRandomOrder()->first();
        $rayon = Rayon::inRandomOrder()->first();
        $vente = Vente::inRandomOrder()->first();

        if (!$produit || !$vente || !$rayon) {
            return []; // éviter erreur si données manquantes
        }

        $quantite = $this->faker->numberBetween(1, 10);
        $prix_unitaire = $this->faker->randomFloat(2, 500, 2000);
        $type_vente = $this->faker->randomElement(['detail', 'semi_gros', 'gros']);

        $montant_ht = $quantite * $prix_unitaire;
        $taux_tva = $produit->tva_applicable ? ($produit->taux_tva ?: 18) : 0;
        $montant_tva = $montant_ht * ($taux_tva / 100);
        $montant_ttc = $montant_ht + $montant_tva;

        return [
            'vente_id' => $vente->id,
            'produit_id' => $produit->id,
            'rayon_id' => $rayon->id,
            'quantite' => $quantite,
            'prix_unitaire' => $prix_unitaire,
            //'prix_vente' => $prix_unitaire,
            'taux_tva' => $taux_tva,
            'montant_tva' => $montant_tva,
            'montant_ht' => $montant_ht,
            'montant_ttc' => $montant_ttc,
            'type_vente' => $type_vente,
        ];
    }
}
