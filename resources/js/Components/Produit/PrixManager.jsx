import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

export default function PrixManager({ produit, prixProduits, onClose }) {
    const [editingPrix, setEditingPrix] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (editingPrix) {
            router.post(`/prix-produits/${editingPrix.id}`, {
                _method: 'PUT',
                ...Object.fromEntries(formData)
            }, {
                onSuccess: () => {
                    toast.success('Prix modifié avec succès !');
                    setEditingPrix(null);
                },
                onError: (errors) => {
                    Object.values(errors).forEach(error => toast.error(error));
                }
            });
        } else {
            formData.append('produit_id', produit.id);
            router.post('/prix-produits', Object.fromEntries(formData), {
                onSuccess: () => {
                    toast.success('Prix créé avec succès !');
                    setEditingPrix(null);
                },
                onError: (errors) => {
                    Object.values(errors).forEach(error => toast.error(error));
                }
            });
        }
    };

    const confirmDelete = (id) => {
        setIdToDelete(id);
        setShowDeleteModal(true);
    };

    const deletePrix = () => {
        router.delete(`/prix-produits/${idToDelete}`, {
            onSuccess: () => {
                toast.success('Prix supprimé avec succès !');
                setShowDeleteModal(false);
            },
            onError: () => toast.error('Erreur lors de la suppression.'),
        });
    };

    // Calculer la marge en temps réel
    const calculateMarge = () => {
        const prixDetail = parseFloat(document.getElementById('edit_prix_detail')?.value || 0);
        const prixAchat = parseFloat(document.getElementById('edit_prix_achat')?.value || 0);
        
        if (!isNaN(prixDetail) && !isNaN(prixAchat)) {
            const marge = prixDetail - prixAchat;
            const pourcentage = prixAchat > 0 ? (marge / prixAchat * 100).toFixed(2) : 0;
            return { marge, pourcentage };
        }
        
        return { marge: 0, pourcentage: 0 };
    };

    const sortedPrixProduits = [...prixProduits].sort((a, b) => new Date(b.date_effet) - new Date(a.date_effet));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-box shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Historique des prix - {produit.nom}</h2>
                        <button onClick={onClose} className="btn btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {editingPrix ? (
                        <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded-box mb-6">
                            <h3 className="font-bold text-lg mb-4">Modifier le prix</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Prix d'achat*</span>
                                    </label>
                                    <input 
                                        id="edit_prix_achat"
                                        type="number" 
                                        step="0.01" 
                                        name="prix_achat" 
                                        defaultValue={editingPrix.prix_achat}
                                        className="input input-bordered w-full" 
                                        required
                                        onChange={() => {
                                            const { marge, pourcentage } = calculateMarge();
                                            document.getElementById('edit_marge_calc').textContent = 
                                                `Marge: ${marge.toLocaleString('fr-FR')} FC (${pourcentage}%)`;
                                        }}
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Prix de vente détail*</span>
                                    </label>
                                    <input 
                                        id="edit_prix_detail"
                                        type="number" 
                                        step="0.01" 
                                        name="prix_detail" 
                                        defaultValue={editingPrix.prix_detail}
                                        className="input input-bordered w-full" 
                                        required
                                        onChange={() => {
                                            const { marge, pourcentage } = calculateMarge();
                                            document.getElementById('edit_marge_calc').textContent = 
                                                `Marge: ${marge.toLocaleString('fr-FR')} FC (${pourcentage}%)`;
                                        }}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <div className="text-sm text-info font-medium" id="edit_marge_calc">
                                        Marge: {(editingPrix.prix_detail - editingPrix.prix_achat).toLocaleString('fr-FR')} FC 
                                        ({editingPrix.prix_achat > 0 ? ((editingPrix.prix_detail - editingPrix.prix_achat) / editingPrix.prix_achat * 100).toFixed(2) : 0}%)
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Quantité semi-gros*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="quantite_semi_gros" 
                                        defaultValue={editingPrix.quantite_semi_gros}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Prix semi-gros*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        name="prix_semi_gros" 
                                        defaultValue={editingPrix.prix_semi_gros}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Quantité gros*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="quantite_gros" 
                                        defaultValue={editingPrix.quantite_gros}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Prix gros*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        name="prix_gros" 
                                        defaultValue={editingPrix.prix_gros}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Date d'effet*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        name="date_effet" 
                                        defaultValue={editingPrix.date_effet.substring(0, 10)}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Date de fin</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        name="date_fin" 
                                        defaultValue={editingPrix.date_fin?.substring(0, 10)}
                                        className="input input-bordered w-full" 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setEditingPrix(null)} className="btn btn-ghost">
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={() => {
                                    setEditingPrix({
                                        produit_id: produit.id,
                                        prix_detail: '',
                                        prix_achat: '',
                                        quantite_semi_gros: 4,
                                        prix_semi_gros: '',
                                        quantite_gros: 10,
                                        prix_gros: '',
                                        date_effet: new Date().toISOString().split('T')[0]
                                    });
                                }}
                                className="btn btn-primary"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Nouveau prix
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Date d'effet</th>
                                    <th>Date de fin</th>
                                    <th>Prix détail</th>
                                    <th>Semi-gros (min {sortedPrixProduits[0]?.quantite_semi_gros || '?'})</th>
                                    <th>Gros (min {sortedPrixProduits[0]?.quantite_gros || '?'})</th>
                                    <th>Prix achat</th>
                                    <th>Marge</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPrixProduits.map(prix => {
                                    const dateEffet = new Date(prix.date_effet).toLocaleDateString('fr-FR');
                                    const dateFin = prix.date_fin ? new Date(prix.date_fin).toLocaleDateString('fr-FR') : 'En cours';
                                    const pourcentageMarge = prix.prix_achat > 0 ? (prix.marge / prix.prix_achat * 100).toFixed(2) : 0;
                                    
                                    return (
                                        <tr key={prix.id} className="hover">
                                            <td>{dateEffet}</td>
                                            <td>{dateFin}</td>
                                            <td>{prix.prix_detail.toLocaleString('fr-FR')} FC</td>
                                            <td>{prix.prix_semi_gros.toLocaleString('fr-FR')} FC</td>
                                            <td>{prix.prix_gros.toLocaleString('fr-FR')} FC</td>
                                            <td>{prix.prix_achat.toLocaleString('fr-FR')} FC</td>
                                            <td>
                                                <div className="tooltip" data-tip={`${pourcentageMarge}%`}>
                                                    {prix.marge.toLocaleString('fr-FR')} FC
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingPrix(prix)}
                                                        className="btn btn-xs btn-ghost"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(prix.id)}
                                                        className="btn btn-xs btn-ghost text-error"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {sortedPrixProduits.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            Aucun prix défini pour ce produit
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-4 border-t">
                    <button onClick={onClose} className="btn btn-primary">
                        Fermer
                    </button>
                </div>
            </div>

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirmation</h3>
                        <p>Voulez-vous vraiment supprimer ce prix ?</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                            <button className="btn btn-error" onClick={deletePrix}>Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}