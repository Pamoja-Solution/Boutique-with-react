<?php

namespace Database\Factories;

use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProduitFactory extends Factory
{
    protected $model = Produit::class;

    public function definition(): array
    {
        $nom = $this->faker->unique()->words(3, true);
        return [
            'nom' => ucfirst($nom),
            'code' => strtoupper(Str::random(8)),
            'categorie_id' => Categorie::inRandomOrder()->first()?->id ?? Categorie::factory(),
            'description' => $this->faker->sentence(),
            'image' => $this->faker->imageUrl(400, 300, 'products', true, 'Produit'),
            'tva_applicable' => $this->faker->boolean(80), // 80% de chance que la TVA soit applicable
            'taux_tva' => $this->faker->randomElement([0, 5.5, 10, 18, 20]),
            'actif' => $this->faker->boolean(90), // 90% de produits actifs
        ];
    }
}
