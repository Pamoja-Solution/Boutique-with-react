<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    //
    use HasFactory;
    protected $fillable=[
        "tva_applicable",
            'nom',
            'code',
            "categorie_id",
            'description',
            'image',
            'tva_applicable',
            'taux_tva',
            'actif',
    ];
    public function categorie()
{
    return $this->belongsTo(Categorie::class);
}

public function rayon()
{
    return $this->belongsTo(Rayon::class);
}
public function prix()
{
    return $this->hasMany(PrixProduit::class);
}

public function stocks()
{
    return $this->hasMany(Stock::class);
}

public function articlesVente()
{
    return $this->hasMany(ArticleVente::class);
}


public function prixActif()
{
    return $this->hasOne(PrixProduit::class)
        ->where(function ($query) {
            $query->whereNull('date_fin')
                  ->orWhere('date_fin', '>', now());
        })
        ->latest('date_effet');
}



    public function inventaireItems(): HasMany
    {
        return $this->hasMany(InventaireItem::class);
    }

    public function getStockActuelAttribute()
{
    $dernierInventaire = $this->inventaireItems()
        ->join('inventaires', 'inventaire_items.inventaire_id', '=', 'inventaires.id')
        ->where('inventaires.statut', 'termine')
        ->orderBy('inventaires.date_inventaire', 'desc')
        ->select('inventaire_items.*')
        ->first();
        
    return $dernierInventaire ? $dernierInventaire->quantite_reelle : 0;
}
}
