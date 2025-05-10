<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategorieFactory extends Factory
{
    protected $model = Categorie::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'Alimentation', 'Boissons', 'Hygiène', 'Electronique',
                'Maison', 'Bébé', 'Loisirs', 'Vêtements'
            ]),
            'description' => $this->faker->sentence,
        ];
    }
}
