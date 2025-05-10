<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaisseMouvement extends Model
{
    use HasFactory;

    //
    protected $fillable = [
'caisse_id',    
            'type',
            'montant',
            'source_type',
            'description',
            'user_id'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
