<?php

namespace Database\Factories;

use App\Models\Produit;
use App\Models\Rayon;
use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockFactory extends Factory
{
    protected $model = Stock::class;

    public function definition(): array
    {
        return [
            'produit_id' => Produit::inRandomOrder()->first()?->id ?? Produit::factory(),
            'rayon_id' => Rayon::inRandomOrder()->first()?->id ?? Rayon::factory(),
            'quantite' => $this->faker->numberBetween(5, 200),
            'quantite_alerte' => $this->faker->numberBetween(5, 20),
        ];
    }
}
