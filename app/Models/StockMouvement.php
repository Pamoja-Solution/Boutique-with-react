<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMouvement extends Model
{
    //
    use HasFactory;
    protected $fillable=[
        'produit_id',
        'rayon_id',
        'quantity',
        'type',
        'motif',
        'user_id',
    ];
}
