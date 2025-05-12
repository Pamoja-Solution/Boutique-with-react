import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ depenses, devises, modesPaiement }) {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentDepense, setCurrentDepense] = useState(null);
    const [formData, setFormData] = useState({
        montant: '',
        devise_id: devises.find(d => d.is_default)?.id || '',
        description: '',
        mode_paiement: 'espece',
        beneficiaire: '',
        date_depense: new Date().toISOString().split('T')[0],
    });

    // Remplacez la fonction handleSearch par :
        const handleSearch = (e) => {
            e.preventDefault();
            router.get('/depenses', { search: searchQuery }, {
                preserveState: true,
                replace: true,
            });
        };

        // Modifiez la partie recherche dans le JSX :
        

    const handleCreate = () => {
        setShowCreateModal(true);
        setFormData({
            montant: '',
            devise_id: devises.find(d => d.is_default)?.id || '',
            description: '',
            mode_paiement: 'espece',
            beneficiaire: '',
            date_depense: new Date().toISOString().split('T')[0],
        });
    };

    const handleEdit = (depense) => {
        
        setCurrentDepense(depense);
        setFormData({
            montant: depense.montant,
            devise_id: depense.devise_id,
            description: depense.description,
            mode_paiement: depense.mode_paiement,
            beneficiaire: depense.beneficiaire,
            date_depense: depense.date_depense.split('T')[0],
        });
        setShowEditModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentDepense) {
            router.put(`/depenses/${currentDepense.id}`, formData, {
                onSuccess: () => {
                    setShowEditModal(false);
                    setCurrentDepense(null);
                },
            });
        } else {
            router.post('/depenses', formData, {
                onSuccess: () => {
                    setShowCreateModal(false);
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
            router.delete(`/depenses/${id}`);
        }
    };

    const formatMoney = (amount, devise) => {
        return `${devise.symbole} ${amount.toFixed(2)}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestion des Dépenses" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Gestion des Dépenses</h1>
                    <button onClick={handleCreate} className="btn btn-primary">
                        Ajouter une Dépense
                    </button>
                </div>

                <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Rechercher des dépenses..."
                        className="input input-bordered w-full max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Rechercher
                    </button>
                    {searchQuery && (
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={() => {
                                setSearchQuery('');
                                router.get('/depenses');
                            }}
                        >
                            Réinitialiser
                        </button>
                    )}
                </form>
                </div>

                <div className="overflow-x-auto shadow-lg">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Description</th>
                                <th>Mode Paiement</th>
                                <th>Bénéficiaire</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depenses.data.map((depense) => (
                                <tr key={depense.id}>
                                    <td>{new Date(depense.date_depense).toLocaleDateString()}</td>
                                    <td>
                                        {formatMoney(depense.montant, depense.devise)}
                                    </td>
                                    <td>{depense.description}</td>
                                    <td className="capitalize">{depense.mode_paiement.replace('_', ' ')}</td>
                                    <td>{depense.beneficiaire || '-'}</td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(depense)}
                                            className="btn btn-sm btn-info"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(depense.id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={depenses.links} className="mt-6" />

                {/* Modal de création */}
                <div className={`modal ${showCreateModal ? 'modal-open' : ''}`}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Ajouter une nouvelle dépense</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Montant</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input input-bordered"
                                    value={formData.montant}
                                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, devise_id: e.target.value })}
                                    required
                                >
                                    {devises.map((devise) => (
                                        <option key={devise.id} value={devise.id}>
                                            {devise.code} ({devise.symbole})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Mode de paiement</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.mode_paiement}
                                    onChange={(e) => setFormData({ ...formData, mode_paiement: e.target.value })}
                                    required
                                >
                                    {modesPaiement.map((mode) => (
                                        <option key={mode} value={mode}>
                                            {mode.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Bénéficiaire (optionnel)</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.beneficiaire}
                                    onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Date de la dépense</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={formData.date_depense}
                                    onChange={(e) => setFormData({ ...formData, date_depense: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => setShowCreateModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Modal d'édition */}
                <div className={`modal ${showEditModal ? 'modal-open' : ''}`}>
                    <div className="modal-box max-w-2xl p-6 rounded-xl shadow-xl">
                        <h3 className="font-bold text-xl mb-6 text-center">Modifier la dépense</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                            <span className="label-text text-base me-6 ">Montant</span>
                            </label>
                            <input
                            type="number"
                            step="0.01"
                            className="input input-bordered"
                            value={formData.montant}
                            onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                            required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                            <span className="label-text text-base me-6">Devise</span>
                            </label>
                            <select
                            className="select select-bordered"
                            value={formData.devise_id}
                            onChange={(e) => setFormData({ ...formData, devise_id: e.target.value })}
                            required
                            >
                            {devises.map((devise) => (
                                <option key={devise.id} value={devise.id}>
                                {devise.code} ({devise.symbole})
                                </option>
                            ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                            <span className="label-text text-base me-6">Description</span>
                            </label>
                            <textarea
                            className="textarea textarea-bordered"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            ></textarea>
                        </div>

                        <div className="form-control">
                            <label className="label">
                            <span className="label-text text-base me-6">Mode de paiement</span>
                            </label>
                            <select
                            className="select select-bordered"
                            value={formData.mode_paiement}
                            onChange={(e) => setFormData({ ...formData, mode_paiement: e.target.value })}
                            required
                            >
                            {modesPaiement.map((mode) => (
                                <option key={mode} value={mode}>
                                {mode.replace('_', ' ')}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                            <span className="label-text text-base me-6">Bénéficiaire (optionnel)</span>
                            </label>
                            <input
                            type="text"
                            className="input input-bordered"
                            value={formData.beneficiaire}
                            onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                            <span className="label-text text-base me-6">Date de la dépense</span>
                            </label>
                            <input
                            type="date"
                            className="input input-bordered"
                            value={formData.date_depense}
                            onChange={(e) => setFormData({ ...formData, date_depense: e.target.value })}
                            required
                            />
                        </div>

                        <div className="modal-action mt-6 flex justify-between">
                            <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setShowEditModal(false)}
                            >
                            Annuler
                            </button>
                            <button type="submit" className="btn btn-primary">
                            Mettre à jour
                            </button>
                        </div>
                        </form>
                    </div>
                    </div>

            </div>
        </AuthenticatedLayout>
    );
}