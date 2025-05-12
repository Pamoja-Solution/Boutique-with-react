<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'montant',
        'devise_id',
        'description',
        'mode_paiement',
        'beneficiaire',
        'date_depense',
    ];

    protected $casts = [
        'date_depense' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function devise()
    {
        return $this->belongsTo(Devise::class);
    }
}