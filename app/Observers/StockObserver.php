<?php

namespace App\Observers;

use App\Events\LowStockAlert;
use App\Models\Stock;
use App\Models\Produit;

class StockObserver
{
    public function updated(Stock $stock)
    {
        if ($stock->quantite <= $stock->quantite_alerte) {
            $produit = Produit::find($stock->produit_id);
            event(new LowStockAlert($stock, $produit));
        }
    }
}