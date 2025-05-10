<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'date_inventaire',
        'statut',
        'notes',
        'user_id'
    ];

    protected $casts = [
        'date_inventaire' => 'date',
    ];

    public const STATUTS = [
        'planifie' => 'Planifié',
        'encours' => 'En cours',
        'termine' => 'Terminé',
        'annule' => 'Annulé'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InventaireItem::class);
    }

    public function getStatutLabelAttribute(): string
    {
        return self::STATUTS[$this->statut] ?? $this->statut;
    }

    public function getEcartTotalAttribute()
{
    return $this->items->sum('ecart');
}

}