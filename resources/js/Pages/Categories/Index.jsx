import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function CategoriesIndex({ auth, categories, stats }) {
    const { flash } = usePage().props;
    const [editCategory, setEditCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    
    useEffect(() => {
        if (editCategory) {
            const modal = document.getElementById('edit_modal');
            if (modal) modal.showModal();
        }
    }, [editCategory]);

    const handleSubmit = (e, isEdit) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (isEdit) {
            router.post(`/categories/${editCategory.id}`, {
                _method: 'PUT',
                ...Object.fromEntries(formData)
            }, {
                onSuccess: () => {
                    toast.success('Catégorie Modifié avec succès')
                    document.getElementById('edit_modal').close();
                    setEditCategory(null);
                }
            });
        } else {
            router.post('/categories', formData, {
                onSuccess: () => {
                    document.getElementById('create_modal').close();
                }
            });
        }
    };

    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const executeDelete = () => {
        router.delete(`/categories/${categoryToDelete.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setCategoryToDelete(null);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestion des catégories" />
            
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestion des catégories</h1>
                    <button 
                        onClick={() => document.getElementById('create_modal').showModal()}
                        className="btn btn-primary"
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Nouvelle catégorie
                    </button>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Total catégories</div>
                            <div className="stat-value">{stats.total_categories}</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Produits total</div>
                            <div className="stat-value">{stats.total_produits}</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Moyenne produits</div>
                            <div className="stat-value">{Math.round(stats.moyenne_produits)}</div>
                            <div className="stat-desc">par catégorie</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Plus utilisée</div>
                            <div className="stat-value text-lg">{stats.categorie_plus_utilisee || 'Aucune'}</div>
                            <div className="stat-desc">{stats.produits_categorie_plus_utilisee || 0} produits</div>
                        </div>
                    </div>
                </div>

                {/* Tableau des catégories */}
                <div className="bg-base-100 rounded-box shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* ... (même en-tête de tableau que précédemment) ... */}
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id} className="hover">
                                        <td>{category.name}</td>
                                        <td>{category.description || '-'}</td>
                                        <td>
                                            <span className={`badge ${category.produits_count > 0 ? 'badge-primary' : 'badge-ghost'}`}>
                                                {category.produits_count}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditCategory(category)}
                                                className="btn btn-sm btn-ghost"
                                            >

                                                    <PencilIcon className="h-4 w-4" />
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(category)}
                                                    className="btn btn-sm btn-error"
                                                    disabled={category.produits_count > 0}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modale de création */}
                <dialog id="create_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Nouvelle catégorie</h3>
                        <div className="divider"></div>
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nom*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    name="description"
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
                {editCategory && (
                    <dialog id="edit_modal" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Modifier {editCategory.name}</h3>
                            <div className="divider"></div>
                            <form onSubmit={(e) => handleSubmit(e, true)}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nom*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={editCategory.name}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">Description</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        defaultValue={editCategory.description || ''}
                                        className="textarea textarea-bordered h-24"
                                    />
                                </div>
                                <div className="modal-action">
                                    <button 
                                        type="button" 
                                        onClick={() => document.getElementById('edit_modal').close()}
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
                            <button onClick={() => setEditCategory(null)}>close</button>
                        </form>
                    </dialog>
                )}

                {/* Modale de confirmation de suppression */}
                {showDeleteModal && (
                    <dialog open className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
                            <p className="py-4">
                                Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.name}" ?
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