<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caisse extends Model
{
    use HasFactory;
    protected $fillable =[
        'name',
        'solde_initial',
        'solde_actuel',
'devise_id',
        'is_active',
    ];
    //
    public function mouvements()
{
    return $this->hasMany(CaisseMouvement::class);
}

public function devise()
{
    return $this->belongsTo(Devise::class);
}
}
