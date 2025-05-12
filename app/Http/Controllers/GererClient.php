<?php

namespace App\Http\Controllers;
use App\Models\Client;
use Inertia\Inertia;
use Illuminate\Http\Request;

class GererClient extends Controller
{
 
    public function index()
    {
        $clients = Client::query()
    ->withCount(['ventes as purchases'])
    ->withSum('ventes as total_spent', 'total_ttc')
    ->orderByDesc('created_at')
    ->get()
    ->map(fn($c) => [
        'id' => $c->id,
        'name' => $c->name,
        'phone' => $c->phone,
        'email' => $c->email,
        'type' => $c->type,
        'purchases' => $c->purchases,
        'total_spent' => $c->total_spent,
        'solde_points' => $c->solde_points,
    ]);


        $bestCustomers = Client::withCount(['ventes as purchases'])
            ->withSum('ventes as total_spent', 'total_ttc')
            ->orderByDesc('total_spent')
            ->take(5)
            ->get()
            ->map(fn($c) => [
                'name' => $c->name,
                'purchases' => $c->purchases,
                'total_spent' => $c->total_spent,
            ]);

        return Inertia::render('GererClients/Index', [
            'clients' => ["data"=>$clients],
            'bestCustomers' => $bestCustomers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'type' => 'required|in:occasionnel,regulier,entreprise',
        ]);

        Client::create($validated);

        return redirect()->back()->with('success', 'Client créé avec succès');
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'type' => 'required|in:occasionnel,regulier,entreprise',
        ]);

        $client->update($validated);

        return redirect()->back()->with('success', 'Client mis à jour avec succès');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->back()->with('success', 'Client supprimé avec succès');
    }
}