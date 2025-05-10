<?php

namespace Database\Factories;

use App\Models\PrixProduit;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class PrixProduitFactory extends Factory
{
    protected $model = PrixProduit::class;

    public function definition(): array
    {
        $produit = Produit::inRandomOrder()->first();

        if (!$produit) {
            return [];
        }

        $prix_achat = $this->faker->randomFloat(2, 500, 1500);
        $marge = $this->faker->randomFloat(2, 10, 30);
        $prix_detail = $prix_achat + ($prix_achat * $marge / 100);
        $prix_semi_gros = $prix_detail - ($prix_detail * 0.1);
        $prix_gros = $prix_detail - ($prix_detail * 0.2);

        return [
            'produit_id' => $produit->id,
            'prix_detail' => $prix_detail,
            'quantite_semi_gros' => 4,
            'prix_semi_gros' => $prix_semi_gros,
            'quantite_gros' => 10,
            'prix_gros' => $prix_gros,
            'prix_achat' => $prix_achat,
            'marge' => $marge,
            'date_effet' => now()->subDays(rand(0, 30))->toDateString(),
            'date_fin' => null,
        ];
    }
}
