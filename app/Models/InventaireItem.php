<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventaireItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantite_theorique',
        'quantite_reelle',
        'ecart',
        'commentaire',
        'inventaire_id',
        'produit_id',
        'rayon_id'
    ];

    public function inventaire(): BelongsTo
    {
        return $this->belongsTo(Inventaire::class);
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function rayon(): BelongsTo
    {
        return $this->belongsTo(Rayon::class);
    }

    protected static function booted()
    {
        static::saving(function ($item) {
            $item->ecart = $item->quantite_reelle - $item->quantite_theorique;
        });
    }
}