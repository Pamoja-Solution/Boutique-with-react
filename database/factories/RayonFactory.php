<?php
namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Rayon;
use Illuminate\Database\Eloquent\Factories\Factory;

class RayonFactory extends Factory
{
    protected $model = Rayon::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->word(),
            //'categorie_id' => Categorie::factory(),
            'code_emplacement' => strtoupper($this->faker->bothify('?##')),
            'description' => $this->faker->sentence(),
        ];
    }
}