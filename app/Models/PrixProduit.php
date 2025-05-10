<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrixProduit extends Model
{
    //
    use HasFactory;
    protected $fillable =[

            'produit_id',
            'prix_detail',
            'quantite_semi_gros',
            'prix_semi_gros',
            'quantite_gros',
            'prix_gros',
            'prix_achat',
            'marge',
            'date_effet',
            'date_fin',
    ];
    public function produit()
{
    return $this->belongsTo(Produit::class);
}
}
