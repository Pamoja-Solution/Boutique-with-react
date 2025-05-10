import React, { useState } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CaisseCreate({ devises }) {
    const [formData, setFormData] = useState({
        name: '',
        solde_initial: '',
        devise_id: devises[0]?.id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('caisses.store'), formData, {
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Créer une Caisse" />
            <div className="flex items-center gap-2 mb-2 bg-base-100 rounded-md">
                        <Link href={route('caisses.index')} className="btn btn-ghost">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-bold">Créer une nouvelle Caisse </h1>
                    </div>
            <div className="container mx-auto px-4 py-8">
            

                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title">Créer une nouvelle caisse</h2>
                        
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
                                                {devise.symbole} ({devise.code}) - {devise.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text">Solde initial</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="input input-bordered"
                                    value={formData.solde_initial}
                                    onChange={(e) => setFormData({...formData, solde_initial: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="card-actions justify-end mt-6">
                                <Link href={route('caisses.index')} className="btn btn-ghost">
                                    Annuler
                                </Link>
                                <button type="submit" className="btn btn-primary">
                                    Créer la caisse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}