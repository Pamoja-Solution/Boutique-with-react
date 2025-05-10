<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
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
        return $user->role->name === 'admin';
    }

    public function view(User $user, Role $role): bool
    {
        return $user->role->name === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role->name === 'admin';
    }

    public function update(User $user, Role $role): bool
    {
        return $user->role->name === 'admin';
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->role->name === 'admin';// && $role->name !== 'admin';
    }
}
