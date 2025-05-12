<?php

namespace App\Policies;

use App\Models\Depense;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DepensePolicy
{
    public function view(User $user, Depense $depense)
    {
        return $user->id === $depense->user_id;
    }

    public function update(User $user, Depense $depense)
    {
        return $user->id === $depense->user_id;
    }

    public function delete(User $user, Depense $depense)
    {
        return $user->id === $depense->user_id;
    }
}