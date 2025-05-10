<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleVente extends Model
{
    use HasFactory;
    protected $table ="articles_vente";
    //
    protected $fillable=[
        
            'vente_id',
            'produit_id',
            'rayon_id',
            'quantite',
            'prix_unitaire',
            'prix_vente',
            'taux_tva',
            'montant_tva', 
            'montant_ht', 
            'montant_ttc',
            'type_vente'
    ];

    public function vente()
{
    return $this->belongsTo(Vente::class);
}

public function produit()
{
    return $this->belongsTo(Produit::class);
}

public function rayon()
{
    return $this->belongsTo(Rayon::class);
}
}
