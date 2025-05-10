<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    //
    protected $fillable=[
        'name',
        'phone',
        'email',
        'address',
        'type', 
        'solde_points'
    ];
    public function ventes()
{
    return $this->hasMany(Vente::class);
}
}
