<?php

namespace App\Events;

use App\Models\Produit;
use App\Models\Stock;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LowStockAlert
{
    use Dispatchable, SerializesModels;

    public $stock;
    public $produit;

    public function __construct(Stock $stock, Produit $produit)
    {
        $this->stock = $stock;
        $this->produit = $produit;
    }
}