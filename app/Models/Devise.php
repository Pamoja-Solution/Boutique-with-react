<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devise extends Model
{
    //

    use HasFactory;
    protected $fillable=[
            'code',
            'symbole',
            'taux_achat',
            'taux_vente',
            'is_default',
    ];
    //protected $table='devises';
    // Méthode pour désactiver
    public function deactivate(): void
    {
        $this->update(['is_default' => false]);
    }

    // Méthode pour réactiver
    public function activate(): void
    {
        $this->update(['is_default' => true]);
    }
}
