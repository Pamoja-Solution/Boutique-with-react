<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
                return [
                    'name' => $this->faker->randomElement(['admin', 'vendeur', 'caissier', 'gestionnaire']),
                    'permissions' => json_encode([]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
    }
}
