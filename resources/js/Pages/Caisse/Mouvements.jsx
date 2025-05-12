import React, { useState } from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import toast from 'react-hot-toast';

export default function CaisseMouvements({ auth, caisse, mouvements }) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'entree',
        montant: '',
        description: ''
    });

    React.useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('caisses.mouvements.store', caisse.id), formData, {
            onSuccess: () => {
                setShowModal(false);
                setFormData({
                    type: 'entree',
                    montant: '',
                    description: ''
                });
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    const handleDelete = (mouvementId) => {
        if (confirm('Annuler ce mouvement ? Cette action est irréversible.')) {
            router.delete(route('caisses.mouvements.destroy', [caisse.id, mouvementId]), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Mouvements - ${caisse.name}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Mouvements de caisse</h1>
                        <h2 className="text-xl">{caisse.name} - Solde: {caisse.solde_actuel.toFixed(2)} {caisse.devise.symbole}</h2>
                    </div>
                    <div className="flex gap-4">
                        <Link href={route('caisses.index')} className="btn btn-ghost">
                            Retour aux caisses
                        </Link>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            Nouveau mouvement
                        </button>
                    </div>
                </div>

                {/* Modal pour nouveau mouvement */}
                <dialog id="mouvement_modal" className={`modal ${showModal ? 'modal-open' : ''}`}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Ajouter un mouvement</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control w-full mt-4">
                                <label className="label">
                                    <span className="label-text">Type</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    required
                                >
                                    <option value="entree">Entrée</option>
                                    <option value="sortie">Sortie</option>
                                </select>
                            </div>

                            <div className="form-control w-full mt-4">
                                <label className="label">
                                    <span className="label-text">Montant ({caisse.devise.symbole})</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="input input-bordered w-full"
                                    value={formData.montant}
                                    onChange={(e) => setFormData({...formData, montant: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control w-full mt-4">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button 
                                    type="button" 
                                    className="btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>

                {/* Liste des mouvements */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Montant</th>
                                        <th>Description</th>
                                        <th>Utilisateur</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mouvements.data.map(mouvement => (
                                        <tr key={mouvement.id}>
                                            <td>{new Date(mouvement.created_at).toLocaleString()}</td>
                                            <td>
                                                <span className={`badge ${
                                                    mouvement.type === 'entree' ? 'badge-success' : 'badge-error'
                                                }`}>
                                                    {mouvement.type}
                                                </span>
                                            </td>
                                            <td className={
                                                mouvement.type === 'entree' ? 'text-success' : 'text-error'
                                            }>
                                                {mouvement.type === 'entree' ? '+' : '-'}
                                                {mouvement.montant.toFixed(2)} {caisse.devise.symbole}
                                            </td>
                                            <td>{mouvement.description}</td>
                                            <td>{mouvement.user.name}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(mouvement.id)}
                                                    className="btn btn-sm btn-error"
                                                >
                                                    Annuler
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={mouvements.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}