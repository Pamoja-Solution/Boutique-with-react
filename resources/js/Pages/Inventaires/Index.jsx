import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentCheckIcon, ArrowRightIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function InventairesIndex({ auth, inventaires, stats }) {
    const { flash } = usePage().props;
    const [editInventaire, setEditInventaire] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [inventaireToDelete, setInventaireToDelete] = useState(null);
    
    useEffect(() => {
        if (editInventaire) {
            const modal = document.getElementById('edit_modal');
            if (modal) modal.showModal();
        }
    }, [editInventaire]);

    const handleSubmit = (e, isEdit) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (isEdit) {
            router.post(`/inventaires/${editInventaire.id}`, {
                _method: 'PUT',
                ...Object.fromEntries(formData)
            }, {
                onSuccess: () => {
                    toast.success('Inventaire modifié avec succès')
                    document.getElementById('edit_modal').close();
                    setEditInventaire(null);
                }
            });
        } else {
            router.post('/inventaires', formData, {
                onSuccess: () => {
                    toast.success('Inventaire créé avec succès')
                    document.getElementById('create_modal').close();
                }
            });
        }
    };

    const confirmDelete = (inventaire) => {
        setInventaireToDelete(inventaire);
        setShowDeleteModal(true);
    };

    const executeDelete = () => {
        router.delete(`/inventaires/${inventaireToDelete.id}`, {
            onSuccess: () => {
                toast.success('Inventaire supprimé avec succès')
                setShowDeleteModal(false);
                setInventaireToDelete(null);
            }
        });
    };
    
    const changeStatus = (inventaire, newStatus) => {
        router.post(`/inventaires/${inventaire.id}/status`, {
            statut: newStatus
        }, {
            onSuccess: () => {
                toast.success(`Statut changé en "${newStatus}"`)
            }
        });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'planifie':
                return <span className="badge badge-info">Planifié</span>;
            case 'encours':
                return <span className="badge badge-warning">En cours</span>;
            case 'termine':
                return <span className="badge badge-success">Terminé</span>;
            case 'annule':
                return <span className="badge badge-error">Annulé</span>;
            default:
                return <span className="badge badge-ghost">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user.user}>
            <Head title="Gestion des inventaires" />
            
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestion des inventaires</h1>
                    {auth.user.role === "admin" && (

                    <button 
                        onClick={() => document.getElementById('create_modal').showModal()}
                        className="btn btn-primary"
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Nouvel inventaire
                    </button>)}
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="stats shadow-lg">
                        <div className="stat">
                            <div className="stat-title">Total inventaires</div>
                            <div className="stat-value">{stats?.total_inventaires || 0}</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow-lg">
                        <div className="stat">
                            <div className="stat-title">Inventaires terminés</div>
                            <div className="stat-value">{stats?.inventaires_termines || 0}</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow-lg">
                        <div className="stat">
                            <div className="stat-title">En cours</div>
                            <div className="stat-value">{stats?.inventaires_encours || 0}</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow-lg">
                        <div className="stat">
                            <div className="stat-title">Écart cumulé</div>
                            <div className="stat-value text-warning">{stats?.ecart_total || 0}</div>
                            <div className="stat-desc">produits</div>
                        </div>
                    </div>
                </div>

                {/* Tableau des inventaires */}
                <div className="bg-base-100 rounded-box shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Référence</th>
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th>Produits</th>
                                    <th>Écart</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventaires.map(inventaire => (
                                    <tr key={inventaire.id} className="hover">
                                        <td>{inventaire.reference}</td>
                                        <td>{formatDate(inventaire.date_inventaire)}</td>
                                        <td>{getStatusBadge(inventaire.statut)}</td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {inventaire.items_count || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${inventaire.ecart_total > 0 ? 'badge-error' : inventaire.ecart_total < 0 ? 'badge-warning' : 'badge-success'}`}>
                                                {inventaire.ecart_total || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                <Link 
                                                    href={`/inventaires/${inventaire.id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    <ClipboardDocumentCheckIcon className="h-4 w-4" />
                                                    Détails
                                                </Link>
                                                
                                                {inventaire.statut === 'planifie' && (
                                                    <>
                                                        <button
                                                            onClick={() => changeStatus(inventaire, 'encours')}
                                                            className="btn btn-sm btn-warning"
                                                        >
                                                            <ArrowRightIcon className="h-4 w-4" />
                                                            Débuter
                                                        </button>
                                                        <button
                                                            onClick={() => setEditInventaire(inventaire)}
                                                            className="btn btn-sm btn-ghost"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(inventaire)}
                                                            className="btn btn-sm btn-error"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                            Supprimer
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {inventaire.statut === 'encours' && (
                                                    <>
                                                        <button
                                                            onClick={() => changeStatus(inventaire, 'termine')}
                                                            className="btn btn-sm btn-success"
                                                        >
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            Terminer
                                                        </button>
                                                        <button
                                                            onClick={() => changeStatus(inventaire, 'annule')}
                                                            className="btn btn-sm btn-error"
                                                        >
                                                            <XCircleIcon className="h-4 w-4" />
                                                            Annuler
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {inventaires.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            Aucun inventaire trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modale de création */}
                <dialog id="create_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Nouvel inventaire</h3>
                        <div className="divider"></div>
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Référence*</span>
                                </label>
                                <input
                                    type="text"
                                    name="reference"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            
                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text">Date de l'inventaire*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date_inventaire"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            
                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text">Notes</span>
                                </label>
                                <textarea
                                    name="notes"
                                    className="textarea textarea-bordered h-24"
                                />
                            </div>
                            
                            <div className="modal-action">
                                <button 
                                    type="button" 
                                    onClick={() => document.getElementById('create_modal').close()}
                                    className="btn btn-ghost"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Créer
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                {/* Modale d'édition */}
                {editInventaire && (
                    <dialog id="edit_modal" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Modifier l'inventaire {editInventaire.reference}</h3>
                            <div className="divider"></div>
                            <form onSubmit={(e) => handleSubmit(e, true)}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Référence*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="reference"
                                        defaultValue={editInventaire.reference}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                
                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">Date de l'inventaire*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date_inventaire"
                                        defaultValue={editInventaire.date_inventaire?.split('T')[0]}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                
                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">Notes</span>
                                    </label>
                                    <textarea
                                        name="notes"
                                        defaultValue={editInventaire.notes || ''}
                                        className="textarea textarea-bordered h-24"
                                    />
                                </div>
                                
                                <div className="modal-action">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            document.getElementById('edit_modal').close();
                                            setEditInventaire(null);
                                        }}
                                        className="btn btn-ghost"
                                    >
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button onClick={() => setEditInventaire(null)}>close</button>
                        </form>
                    </dialog>
                )}

                {/* Modale de confirmation de suppression */}
                {showDeleteModal && (
                    <dialog open className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
                            <p className="py-4">
                                Êtes-vous sûr de vouloir supprimer l'inventaire "{inventaireToDelete?.reference}" ?
                                Cette action est irréversible.
                            </p>
                            <div className="modal-action">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="btn btn-ghost"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={executeDelete}
                                    className="btn btn-error"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}