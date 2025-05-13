<?php

namespace App\Events;

use App\Models\Vente;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VenteCompleted
{
    use Dispatchable, SerializesModels;

    public $vente;

    public function __construct(Vente $vente)
    {
        $this->vente = $vente;
    }
}