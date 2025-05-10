import React, { useState } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CaisseEdit({ caisse, devises }) {
    const [formData, setFormData] = useState({
        name: caisse[0].name,
        devise_id: caisse[0].devise_id,
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('caisses.update', caisse[0].id), formData, {
            onSuccess: () => {
                toast.success("Caisse mise à jour avec succès");
                //location.reload(); // ⚠️ recharge la page
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Éditer ${caisse[0].name}`} />
            <div className="flex items-center gap-2 mb-2 bg-base-100 rounded-md">
                        <Link href={route('caisses.index')} className="btn btn-ghost">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-bold">Caisse {caisse[0].name}</h1>
                    </div>
            <div className="container mx-auto px-4 py-8">
                    
                <div className="card bg-base-100 shadow">
                    
                    <div className="card-body">
                        <h2 className="card-title">Éditer la caisse: {caisse[0].name}</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nom de la caisse</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Devise</span>
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={formData.devise_id}
                                        onChange={(e) => setFormData({...formData, devise_id: e.target.value})}
                                        required
                                    >
                                        {devises.map(devise => (
                                            <option key={devise.id} value={devise.id}>
                                                {devise.symbole} ({devise.code}) 
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Informations complémentaires</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   
                                    <div>
                                        <p><strong>Solde initial:</strong> {caisse[0].solde_initial.toFixed(2)} {devises[0].symbole}</p>
                                    </div>
                                    <div>
                                        <p><strong>Solde actuel:</strong> {caisse[0].solde_actuel.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p><strong>Statut:</strong> 
                                            <span className={`badge ml-2 ${
                                                caisse[0].is_active ? 'badge-success' : 'badge-error'
                                            }`}>
                                                {caisse[0].is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p><strong>Créée le:</strong> {new Date(caisse[0].created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions justify-end mt-6">
                                <Link href={route('caisses.index')} className="btn btn-ghost">
                                    Annuler
                                </Link>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}