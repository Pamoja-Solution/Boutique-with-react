<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function viewAny(User $user): bool
    {
        return in_array($user->role->name, ['admin', 'gestionnaire']);
    }

    public function view(User $user, User $model): bool
    {
        return $user->role->name === 'admin' 
            || $user->id === $model->id
            || ($user->role->name === 'gestionnaire' && $model->role->name !== 'admin');
    }

    public function create(User $user): bool
    {
        return in_array($user->role->name, ['admin', 'gestionnaire']);
    }

    public function update(User $user, User $model): bool
    {
        return $user->role->name === 'admin'
            || $user->id === $model->id
            || ($user->role->name === 'gestionnaire' && $model->role->name !== 'admin');
    }

    public function delete(User $user, User $model): bool
    {
        // Remplacer la suppression par la désactivation
        return $user->isAdmin(); 
           // && $user->id !== $model->id
            //&& $model->role->name !== 'admin';
    }

    public function restore(User $user): bool
    {
        return $user->isAdmin();
    }
}
