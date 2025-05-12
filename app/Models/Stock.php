<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    //
    use HasFactory;
    protected $fillable=[
        
            'produit_id',
            'rayon_id',
            'quantite',
            'quantite_alerte',
    ];

    public function produit()
{
    return $this->belongsTo(Produit::class);
}

public function rayon()
{
    return $this->belongsTo(Rayon::class);
}

public function mouvements()
{
    return $this->hasMany(StockMouvement::class);
}
public function prixProduit()
{
    return $this->hasOne(PrixProduit::class, 'produit_id', 'produit_id')
                ->where('date_fin', null)
                ->latest('date_effet');
}


}
