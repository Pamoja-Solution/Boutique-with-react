<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use App\Models\Devise;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class DepenseController extends Controller
{
    public function index(Request $request)
        {
            $search = $request->input('search');

            $depenses = Depense::with(['devise', 'user'])
                ->where('user_id', Auth::id())
                ->when($search, function($query) use ($search) {
                    $query->where(function($q) use ($search) {
                        $q->where('description', 'like', "%$search%")
                        ->orWhere('beneficiaire', 'like', "%$search%")
                        ->orWhere('mode_paiement', 'like', "%$search%");
                    });
                })
                ->latest()
                ->paginate(10);

            return Inertia::render('Depenses/Index', [
                'depenses' => $depenses,
                'devises' => Devise::all(),
                'modesPaiement' => ['espece', 'carte', 'cheque', 'mobile_money'],
                'searchQuery' => $search ?? '',
            ]);
        }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'devise_id' => 'required|exists:devises,id',
            'description' => 'required|string|max:500',
            'mode_paiement' => 'required|in:espece,carte,cheque,mobile_money',
            'beneficiaire' => 'nullable|string|max:255',
            'date_depense' => 'required|date',
        ]);

        $depense = Auth::user()->depenses()->create($validated);

        return redirect()->back()->with('success', 'Dépense enregistrée avec succès!');
    }

    public function update(Request $request, Depense $depense)
    {
        //$this->authorize('update', $depense);
        try {
            //$this->authorize('update', $depense);
        Gate::authorize('viewAny', $depense);

        } catch (AuthorizationException $e) {
            return redirect()->back()->with('error', 'Action non autorisée : Vous ne pouvez pas modifier cette dépense.');
        }

        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'devise_id' => 'required|exists:devises,id',
            'description' => 'required|string|max:500',
            'mode_paiement' => 'required|in:espece,carte,cheque,mobile_money',
            'beneficiaire' => 'nullable|string|max:255',
            'date_depense' => 'required|date',
        ]);

        $depense->update($validated);

        return redirect()->back()->with('success', 'Dépense mise à jour avec succès!');
    }

    public function show(){

    }

    public function search(Request $request)
    {
        $search = $request->input('search');

        $depenses = Depense::with(['devise', 'user'])
            ->where('user_id', Auth::id())
            ->when($search, function($query) use ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('description', 'like', "%$search%")
                    ->orWhere('beneficiaire', 'like', "%$search%")
                    ->orWhere('mode_paiement', 'like', "%$search%");
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Depenses/Index', [
            'depenses' => $depenses,
            'devises' => Devise::all(),
            'modesPaiement' => ['espece', 'carte', 'cheque', 'mobile_money'],
            'searchQuery' => $search ?? '',
        ]);
    }
    public function destroy(Depense $depense)
    {
        //$this->authorize('delete', $depense);
        try {
            //$this->authorize('update', $depense);
        Gate::authorize('viewAny', $depense);

        } catch (AuthorizationException $e) {
            return redirect()->back()->with('error', 'Action non autorisée : Vous ne pouvez pas supprimer cette dépense.');
        }
        $depense->delete();

        return redirect()->back()->with('success', 'Dépense supprimée avec succès!');
    }

    public function edit(){

    }
    
}