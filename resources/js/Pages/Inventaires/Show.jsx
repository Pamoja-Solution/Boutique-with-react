import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, PlusIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function InventaireShow({ auth, inventaire, produits, rayons }) {
    const { flash } = usePage().props;
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProduits, setFilteredProduits] = useState(produits);
    
    useEffect(() => {
        if (selectedItem) {
            const modal = document.getElementById('edit_item_modal');
            if (modal) modal.showModal();
        }
    }, [selectedItem]);
    
    useEffect(() => {
        setFilteredProduits(
            produits.filter(produit => 
                produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                produit.code.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, produits]);

    const handleAddItem = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        router.post(`/inventaires/${inventaire.id}/items`, formData, {
            onSuccess: () => {
                toast.success("Produit ajouté à l'inventaire");
                document.getElementById('add_item_modal').close();
                e.target.reset();
            }
        });
    };
    
    const handleUpdateItem = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        router.post(`/inventaires/${inventaire.id}/items/${selectedItem.id}`, {
            _method: 'PUT',
            ...Object.fromEntries(formData)
        }, {
            onSuccess: () => {
                toast.success("Quantité mise à jour");
                document.getElementById('edit_item_modal').close();
                setSelectedItem(null);
            }
        });
    };
    
    const removeItem = (itemId) => {
        if (confirm("Êtes-vous sûr de vouloir retirer ce produit de l'inventaire?")) {
            router.delete(`/inventaires/${inventaire.id}/items/${itemId}`, {
                onSuccess: () => {
                    toast.success("Produit retiré de l'inventaire");
                }
            });
        }
    };
    
    const calculateEcart = (theorique, reelle) => {
        return reelle - theorique;
    };
    
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
        } catch (e) {
            return dateString;
        }
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
    
    const isInventaireEditable = ['planifie', 'encours'].includes(inventaire.statut);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Inventaire ${inventaire.reference}`} />
            
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                    <div className="flex items-center gap-2">
                        <Link href={route('inventaires.index')} className="btn btn-ghost">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-bold">Inventaire {inventaire.reference}</h1>
                        {getStatusBadge(inventaire.statut)}
                    </div>
                    
                    {isInventaireEditable && (
                        <button 
                            onClick={() => document.getElementById('add_item_modal').showModal()}
                            className="btn btn-primary"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Ajouter un produit
                        </button>
                    )}
                </div>
                
                {/* Informations générales */}
                <div className="bg-base-100 rounded-box shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="text-lg font-medium">Détails</h3>
                            <p><strong>Date:</strong> {formatDate(inventaire.date_inventaire)}</p>
                            <p><strong>Status:</strong> {inventaire.statut}</p>
                            <p><strong>Créé par:</strong> {inventaire.user?.name || 'Inconnu'}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium">Sommaire</h3>
                            <p><strong>Produits inventoriés:</strong> {inventaire.items?.length || 0}</p>
                            <p><strong>Écart total:</strong> {inventaire.items?.reduce((acc, item) => acc + (item.ecart || 0), 0) || 0}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium">Notes</h3>
                            <p>{inventaire.notes || 'Aucune note'}</p>
                        </div>
                    </div>
                </div>
                
                {inventaire.items?.length ? (
                    <div className="bg-base-100 rounded-box shadow-lg overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Produit</th>
                                        <th>Rayon</th>
                                        <th>Théorique</th>
                                        <th>Réelle</th>
                                        <th>Écart</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventaire.items.map(item => (
                                        <tr key={item.id} className="hover">
                                            <td>{item.produit?.code}</td>
                                            <td>{item.produit?.nom}</td>
                                            <td>{item.rayon?.nom}</td>
                                            <td>{item.quantite_theorique}</td>
                                            <td className={isInventaireEditable ? "font-bold text-primary" : ""}>
                                                {item.quantite_reelle}
                                            </td>
                                            <td>
                                                <span className={`badge ${item.ecart > 0 ? 'badge-error' : item.ecart < 0 ? 'badge-warning' : 'badge-success'}`}>
                                                    {item.ecart}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    {isInventaireEditable && (
                                                        <>
                                                            <button
                                                                onClick={() => setSelectedItem(item)}
                                                                className="btn btn-sm btn-ghost"
                                                            >
                                                                Quantité
                                                            </button>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="btn btn-sm btn-error"
                                                            >
                                                                Retirer
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    {!isInventaireEditable && (
                                                        <button
                                                            onClick={() => setSelectedItem(item)}
                                                            className="btn btn-sm btn-ghost"
                                                        >
                                                            <InformationCircleIcon className="h-4 w-4" />
                                                            Détails
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <InformationCircleIcon className="h-6 w-6" />
                        <span>Aucun produit n'a encore été ajouté à cet inventaire.</span>
                    </div>
                )}
                
                {/* Modale pour ajouter un produit */}
                <dialog id="add_item_modal" className="modal">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg">Ajouter un produit à l'inventaire</h3>
                        <div className="divider"></div>
                        
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Rechercher un produit</span>
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Nom ou code du produit..."
                                className="input input-bordered w-full"
                            />
                        </div>
                        
                        <form onSubmit={handleAddItem}>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Produit*</span>
                                </label>
                                <select name="produit_id" className="select select-bordered w-full" required>
                                    <option value="">Sélectionnez un produit</option>
                                    {filteredProduits.map(produit => (
                                        <option key={produit.id} value={produit.id}>
                                            {produit.code} - {produit.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Rayon*</span>
                                </label>
                                <select name="rayon_id" className="select select-bordered w-full" required>
                                    <option value="">Sélectionnez un rayon</option>
                                    {rayons.map(rayon => (
                                        <option key={rayon.id} value={rayon.id}>
                                            {rayon.code_emplacement} - {rayon.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Quantité théorique*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantite_theorique"
                                    min="0"
                                    defaultValue="0"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Quantité réelle*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantite_reelle"
                                    min="0"
                                    defaultValue="0"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Commentaire</span>
                                </label>
                                <textarea
                                    name="commentaire"
                                    className="textarea textarea-bordered h-24"
                                />
                            </div>
                            
                            <div className="modal-action">
                                <button 
                                    type="button" 
                                    onClick={() => document.getElementById('add_item_modal').close()}
                                    className="btn btn-ghost"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
                
                {/* Modale d'édition d'un item */}
                {selectedItem && (
                    <dialog id="edit_item_modal" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                {isInventaireEditable 
                                    ? `Modifier la quantité de ${selectedItem.produit?.nom}` 
                                    : `Détails du produit ${selectedItem.produit?.nom}`}
                            </h3>
                            <div className="divider"></div>
                            
                            <form onSubmit={handleUpdateItem}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Produit</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedItem.produit?.nom}
                                        className="input input-bordered w-full"
                                        disabled
                                    />
                                </div>
                                
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Rayon</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedItem.rayon?.nom}
                                        className="input input-bordered w-full"
                                        disabled
                                    />
                                </div>
                                
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Quantité théorique</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantite_theorique"
                                        defaultValue={selectedItem.quantite_theorique}
                                        className="input input-bordered w-full"
                                        disabled={!isInventaireEditable}
                                        required
                                    />
                                </div>
                                
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Quantité réelle</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantite_reelle"
                                        defaultValue={selectedItem.quantite_reelle}
                                        min="0"
                                        className="input input-bordered w-full"
                                        disabled={!isInventaireEditable}
                                        required
                                    />
                                </div>
                                
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Commentaire</span>
                                    </label>
                                    <textarea
                                        name="commentaire"
                                        defaultValue={selectedItem.commentaire || ''}
                                        className="textarea textarea-bordered h-24"
                                        disabled={!isInventaireEditable}
                                    />
                                </div>
                                
                                <div className="modal-action">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            document.getElementById('edit_item_modal').close();
                                            setSelectedItem(null);
                                        }}
                                        className="btn btn-ghost"
                                    >
                                        {isInventaireEditable ? "Annuler" : "Fermer"}
                                    </button>
                                    
                                    {isInventaireEditable && (
                                        <button type="submit" className="btn btn-primary">
                                            Enregistrer
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button onClick={() => setSelectedItem(null)}>close</button>
                        </form>
                    </dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}