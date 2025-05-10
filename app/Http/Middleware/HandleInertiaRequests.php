<?php

namespace App\Http\Middleware;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $translations = [];
        $locale =  app()->getLocale();
        $path = lang_path("{$locale}.json");
        //dd($path);
        try {
            if (file_exists($path)) {
                $translations = json_decode(file_get_contents($path), true) ?? [];
            }
        } catch (\Exception $e) {
            report($e);
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()? $this->getUserData($request->user()) : null,
            ],
            'translations' => $translations,

            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
    protected function getUserData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'photo' => $user->photo,
            'role' => $user->role->name,
            'permissions' => $this->getUserPermissions($user),
            'is_active' => $user->is_active,
        ];
    }

    protected function getUserPermissions(User $user): array
    {
        return [
            'users' => [
                'viewAny' => $user->can('viewAny', User::class),
                'create' => $user->can('create', User::class),
                'update' => $user->can('update', $user),
                'delete' => $user->can('delete', $user),
                'restore' => $user->can('restore', User::class),

            ],
            'roles' => [
                'viewAny' => $user->can('viewAny', Role::class),
                'create' => $user->can('create', Role::class),
            ],
            'products' => [
                'manage' => in_array($user->role->name, ['admin', 'gestionnaire', 'vendeur']),
            ],
            'sales' => [
                'create' => in_array($user->role->name, ['vendeur', 'caissier']),
                'viewReports' => in_array($user->role->name, ['admin', 'gestionnaire']),
            ],
        ];
    }
}
