<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;
    //
    public function produits()
{
    return $this->hasMany(Produit::class);
}

public function rayons()
{
    return $this->hasMany(Rayon::class);
}

protected $fillable = ['name', 'description'];



        // Méthode pour obtenir les statistiques
        public static function withStats()
    {
        return static::withCount('produits')
            ->orderBy('produits_count', 'desc')
            ->get();
}
}
