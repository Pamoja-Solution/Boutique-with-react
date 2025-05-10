<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeviseRequest;
use App\Models\Devise;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DeviseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //dd(Devise::all());
        $actu=Devise::where('is_default',true)->first();
        return Inertia::render('Monnaie/Index', [
            'devises' => Devise::paginate(10),
            'Actu'=>[
                "id"=>$actu->id??"",
                "code"=>$actu->code??"",
                "symbole"=>$actu->symbole??"",
                "taux_achat"=>$actu->taux_achat??"",
                "taux_vente"=>$actu->taux_vente??"",
                "created_at"=>$actu?$actu->created_at->diffForHumans():"",

            ]

            
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DeviseRequest $request)
    {
        $data=($request->validated());
        Devise::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Devise::where('is_default',true)->get();
    }

    

    /**
     * Show the form for editing the specified resource.
     */
    public function get()
    {
        //
        $actu=Devise::where('is_default',true)->first();
        return   
            ['systeme'=>[
                "id"=>$actu->id,
                "code"=>$actu->code,
                "symbole"=>$actu->symbole,
                "taux_achat"=>$actu->taux_achat,
                "taux_vente"=>$actu->taux_vente,
                "created_at"=>$actu->created_at->diffForHumans(),

            ]];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function desactivate($id)
    {
        $devise = Devise::findOrFail($id);

        $devise->deactivate();
        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès');
    }

    public function restore($id)
    {
        $devise = Devise::findOrFail($id);
        Gate::authorize('viewAny', User::class);

        $devise->activate();

        return redirect()->back()
            ->with('success', 'Utilisateur réactivé avec succès');
    }
}
