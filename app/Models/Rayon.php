<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rayon extends Model
{
    //
    use HasFactory;
    public function categorie()
{
    return $this->belongsTo(Categorie::class);
}

public function stocks()
{
    return $this->hasMany(Stock::class);
}
public function inventaireItems(): HasMany
    {
        return $this->hasMany(InventaireItem::class);
    }
    
    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class);
    }
    public function getProduitsCountAttribute()
{
    return $this->inventaireItems()
        ->where('inventaire_id', function($query) {
            $query->select('id')
                ->from('inventaires')
                ->where('statut', 'termine')
                ->orderBy('date_inventaire', 'desc')
                ->limit(1);
        })
        ->count();
}
}
