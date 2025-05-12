<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
class Vente extends Model
{
    //
    use HasFactory;
    protected $fillable =[
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
            'type_vente',

'code',
                'client_id',
                'user_id',
                'total_ht', 
                'total_tva', 
                'total_ttc', 
                'montant_remise',
                'montant_paye', 
                'remise',
                'statut', 
                'notes',
    ];

        public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

public function articles()
{
    return $this->hasMany(ArticleVente::class);
}

public function paiements()
{
    return $this->hasMany(Paiement::class);
}
public function scopeToday(Builder $query)
{
    return $query->whereDate('created_at', Carbon::today());
}
public function scopeFilter($query, $filters)
{
    return $query
        ->when($filters['dateDebut'] ?? null, fn($q, $date) =>
            $q->whereDate('created_at', '>=', $date)
        )
        ->when($filters['dateFin'] ?? null, fn($q, $date) =>
            $q->whereDate('created_at', '<=', $date)
        )
        ->when($filters['statut'] ?? null, fn($q, $statut) =>
            $q->where('statut', $statut)
        )
        ->when($filters['search'] ?? null, fn($q, $search) =>
            $q->whereHas('client', fn($sub) =>
                $sub->where('nom', 'like', "%{$search}%")
            )
        );
}
public function articles_vente()
{
    return $this->hasMany(ArticleVente::class); // adapte le nom de la classe si besoin
}


public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function prixProduits()
    {
        return $this->hasMany(PrixProduit::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function mouvementsStock()
    {
        return $this->hasMany(StockMouvement::class);
    }

    public function articlesVente()
    {
        return $this->hasMany(ArticleVente::class);
    }
}
