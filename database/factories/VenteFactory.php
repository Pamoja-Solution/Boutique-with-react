<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use App\Models\Vente;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VenteFactory extends Factory
{
    protected $model = Vente::class;

    public function definition(): array
    {
        $statuts = ['encours', 'terminee', 'annulee'];
        $types = ['detail', 'semi_gros', 'gros'];

        $total_ht = $this->faker->randomFloat(2, 1000, 10000);
        $tva = $total_ht * 0.18;
        $remise = $this->faker->randomFloat(2, 0, 500);
        $ttc = $total_ht + $tva - $remise;

        return [
            'code' => 'VENTE-' . strtoupper(Str::random(8)),
            'client_id' => Client::inRandomOrder()->first()?->id,
            'user_id' => User::inRandomOrder()->first()?->id,
            'total_ht' => $total_ht,
            'total_tva' => $tva,
            'total_ttc' => $ttc,
            'montant_remise' => $remise,
            'montant_paye' => $ttc,
            'remise' => $remise,
            'statut' => $this->faker->randomElement($statuts),
//            'type_vente' => $this->faker->randomElement($types),
            'notes' => $this->faker->optional()->sentence,
            'created_at' => $this->faker->optional()->dateTimeBetween('-1 months', 'now'), // Optionnel : date de suppression

        ];
    }
}
