<?php
namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->optional(0.7)->safeEmail(),
            'address' => $this->faker->optional(0.5)->address(),
            'type' => $this->faker->randomElement(['occasionnel', 'regulier', 'entreprise']),
            'solde_points' => $this->faker->numberBetween(0, 1000),
        ];
    }
}