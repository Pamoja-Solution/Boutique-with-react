<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'photo',
        'role_id',
        'is_active'
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function role()
{
    return $this->belongsTo(Role::class);
}

public function ventes()
{
    return $this->hasMany(Vente::class);
}

public function depenses()
{
    return $this->hasMany(Depense::class);
}

// Scope pour les utilisateurs actifs
public function scopeActive(Builder $query): void
{
    $query->where('is_active', true);
}

// Méthode pour désactiver
public function deactivate(): void
{
    $this->update(['is_active' => false]);
}

// Méthode pour réactiver
public function activate(): void
{
    $this->update(['is_active' => true]);
}

public function isAdmin(): bool
    {
        return $this->role->name === 'admin';
    }

    public function isManager(): bool
    {
        return $this->role->name === 'gestionnaire';
    }

    public function isSeller(): bool
    {
        return $this->role->name === 'vendeur';
    }

    public function isCashier(): bool
    {
        return $this->role->name === 'caissier';
    }

    // Méthode pour vérifier plusieurs rôles
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role->name, $roles);
    }
}
