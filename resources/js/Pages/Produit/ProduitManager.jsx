import React, { useState, useEffect } from 'react';
import { router, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast } from 'react-hot-toast';
import StockManager from '@/Components/Stock/StockManager';
import PrixManager from '@/Components/Produit/PrixManager';

export default function ProduitManager({ auth, produits, categories, rayons, prixProduits, stocks, flash }) {
    const [editingProduit, setEditingProduit] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState('liste');
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [showPrixManager, setShowPrixManager] = useState(false);
    const [showStockManager, setShowStockManager] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [initialPrixData, setInitialPrixData] = useState({
        prix_detail: '',
        prix_achat: '',
        quantite_semi_gros: 4,
        prix_semi_gros: '',
        quantite_gros: 10,
        prix_gros: '',
        date_effet: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (editingProduit) {
            router.post(`/produits/${editingProduit.id}`, {
                _method: 'PUT',
                ...Object.fromEntries(formData)
            }, {
                onSuccess: () => {
                    toast.success('Produit modifié avec succès !');
                    document.getElementById('produit_modal').close();
                },
                onError: (errors) => {
                    Object.values(errors).forEach(error => toast.error(error));
                }
            });
        } else {
            router.post('/produits', formData, {
                onSuccess: () => {
                    toast.success('Produit créé avec succès !');
                    document.getElementById('produit_modal').close();
                },
                onError: (errors) => {
                    Object.values(errors).forEach(error => toast.error(error));
                }
            });
        }
    };

    const handlePrixSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        router.post('/prix-produits', Object.fromEntries(formData), {
            onSuccess: () => {
                toast.success('Prix créé avec succès !');
                document.getElementById('prix_modal').close();
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    const confirmDelete = (id) => {
        setIdToDelete(id);
        setShowModal(true);
    };

    const deleteProduit = () => {
        router.delete(`/produits/${idToDelete}`, {
            onSuccess: () => {
                toast.success('Produit supprimé avec succès !');
                setShowModal(false);
            },
            onError: () => toast.error('Erreur lors de la suppression.'),
        });
    };

    // Filtrer les produits selon le terme de recherche
    const filteredProduits = produits.filter(produit => 
        produit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.categorie?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProduits.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProduits.length / itemsPerPage);

    // Ouvrir le modal des prix
    const openPrixModal = (produit) => {
        setSelectedProduit(produit);
        
        // Récupérer le dernier prix si disponible
        const dernierPrix = prixProduits
            .filter(p => p.produit_id === produit.id)
            .sort((a, b) => new Date(b.date_effet) - new Date(a.date_effet))[0];
            
        if (dernierPrix) {
            setInitialPrixData({
                prix_detail: dernierPrix.prix_detail,
                prix_achat: dernierPrix.prix_achat,
                quantite_semi_gros: dernierPrix.quantite_semi_gros,
                prix_semi_gros: dernierPrix.prix_semi_gros,
                quantite_gros: dernierPrix.quantite_gros,
                prix_gros: dernierPrix.prix_gros,
                date_effet: new Date().toISOString().split('T')[0]
            });
        } else {
            setInitialPrixData({
                prix_detail: '',
                prix_achat: '',
                quantite_semi_gros: 4,
                prix_semi_gros: '',
                quantite_gros: 10,
                prix_gros: '',
                date_effet: new Date().toISOString().split('T')[0]
            });
        }
        
        document.getElementById('prix_modal').showModal();
    };

    // Ouvrir le gestionnaire de stock
    const openStockManager = (produit) => {
        setSelectedProduit(produit);
        setShowStockManager(true);
    };

    // Calculer la marge en temps réel
    const calculateMarge = () => {
        const prixDetail = parseFloat(document.getElementById('prix_detail')?.value || 0);
        const prixAchat = parseFloat(document.getElementById('prix_achat')?.value || 0);
        
        if (!isNaN(prixDetail) && !isNaN(prixAchat)) {
            const marge = prixDetail - prixAchat;
            const pourcentage = prixAchat > 0 ? (marge / prixAchat * 100).toFixed(2) : 0;
            return { marge, pourcentage };
        }
        
        return { marge: 0, pourcentage: 0 };
    };

    return (
        <AuthenticatedLayout user={auth.user} flash={flash}>
            <Head title="Gestion des produits" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Gestion des produits</h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => {
                                setEditingProduit(null);
                                document.getElementById('produit_modal').showModal();
                            }}
                            className="btn btn-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Nouveau produit
                        </button>
                    </div>
                </div>

                {/* Onglets de navigation */}
                <div className="tabs tabs-boxed mb-6">
                    <button
                        className={`tab ${activeTab === 'liste' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('liste')}
                    >
                        Liste des produits
                    </button>
                    <button
                        className={`tab ${activeTab === 'alertes' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('alertes')}
                    >
                        Alertes de stock
                    </button>
                </div>

                {activeTab === 'liste' && (
                    <>
                        {/* Barre de recherche et pagination en haut */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">

                            {/* Champ de recherche */}
                                <div className="join w-full">
                                <label className="input">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                        >
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                        </g>
                                    </svg>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className='input'
                                    value={searchTerm}
                                    onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                    }}
                                />
                                </label>
                               
                                </div>

                            {/* Résultat + sélection */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">{filteredProduits.length} produits trouvés</span>
                                <select
                                className="select select-bordered "
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                >
                                <option value={10}>10/page</option>
                                <option value={25}>25/page</option>
                                <option value={50}>50/page</option>
                                <option value={100}>100/page</option>
                                </select>
                            </div>
                            </div>

                        {/* Tableau des produits */}
                        <div className="bg-base-100 rounded-box shadow over mb-8">
                            <div className="">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Nom</th>
                                            <th>Catégorie</th>
                                            <th>Prix</th>
                                            <th>Stock</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map(produit => {
                                            const dernierPrix = prixProduits
                                                .filter(p => p.produit_id === produit.id)
                                                .sort((a, b) => new Date(b.date_effet) - new Date(a.date_effet))[0];
                                            
                                            const totalStock = stocks
                                                .filter(s => s.produit_id === produit.id)
                                                .reduce((sum, s) => sum + s.quantite, 0);
            
                                            return (
                                                <tr key={produit.id} className="hover">
                                                    <td>{produit.code}</td>
                                                    <td>{produit.nom}</td>
                                                    <td>{produit.categorie?.name}</td>
                                                    <td>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {dernierPrix ? dernierPrix.prix_detail.toLocaleString('fr-FR') + ' FC' : 'Non défini'}
                                                            </span>
                                                            {dernierPrix && (
                                                                <span className="text-xs opacity-70">
                                                                    Marge: {dernierPrix.marge.toLocaleString('fr-FR')} FC
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            onClick={() => openStockManager(produit)}
                                                            className={`badge ${totalStock <= 0 ? 'badge-error' : 
                                                                totalStock <= (stocks.find(s => s.produit_id === produit.id)?.quantite_alerte || 10) ? 
                                                                'badge-warning' : 'badge-success'}`}
                                                        >
                                                            {totalStock} unités
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${produit.actif ? 'badge-success' : 'badge-error'}`}>
                                                            {produit.actif ? 'Actif' : 'Inactif'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="relative dropdown dropdown-end">
                                                            <details className="dropdown">
                                                            <summary className="btn btn-sm btn-ghost">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                </svg>
                                                            </summary>
                                                            <ul className="absolute p-2 shadow menu dropdown-content z-[50] bg-base-100 rounded-box w-52 mt-1">                                                                <li>
                                                            <button
                                                                    onClick={() => {
                                                                    setEditingProduit(produit);
                                                                    document.getElementById('produit_modal').showModal();
                                                                    setShowActionMenu(null);
                                                                    }}
                                                            > 
                                                                                           ✏️ Modifier produit
                                                                </button>
                                                                </li>
                                                                <li>
                                                                <button onClick={() => openPrixModal(produit)}>
                                                                    💰 Gérer les prix
                                                                </button>
                                                                </li>
                                                                <li>
                                                                <button onClick={() => openStockManager(produit)}>
                                                                    📦 Gérer le stock
                                                                </button>
                                                                </li>
                                                                <li>
                                                                <button onClick={() => confirmDelete(produit.id)} className="text-error">
                                                                    🗑️ Supprimer
                                                                </button>
                                                                </li>
                                                            </ul>
                                                            </details>
                                                        </div>
                                                        </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center my-4">
                                <div className="join">
                                    <button 
                                        className="join-item btn" 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`join-item btn ${currentPage === pageNum ? 'btn-active' : ''}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button 
                                        className="join-item btn" 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        »
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'alertes' && (
                    <div className="bg-base-100 rounded-box shadow overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Nom</th>
                                        <th>Catégorie</th>
                                        <th>Stock</th>
                                        <th>Seuil d'alerte</th>
                                        <th>Rayon</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.filter(stock => stock.quantite <= stock.quantite_alerte).map(stock => {
                                        const produit = produits.find(p => p.id === stock.produit_id);
                                        if (!produit) return null;
                                        
                                        return (
                                            <tr key={`${stock.produit_id}-${stock.rayon_id}`} className="hover">
                                                <td>{produit.code}</td>
                                                <td>{produit.nom}</td>
                                                <td>{produit.categorie?.name}</td>
                                                <td>
                                                    <span className={`badge ${stock.quantite <= 0 ? 'badge-error' : 'badge-warning'}`}>
                                                        {stock.quantite} unités
                                                    </span>
                                                </td>
                                                <td>{stock.quantite_alerte} unités</td>
                                                <td>{stock.rayon?.nom}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => openStockManager(produit)}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        Gérer
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {stocks.filter(stock => stock.quantite <= stock.quantite_alerte).length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                Aucune alerte de stock à afficher
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal de confirmation de suppression */}
                {showModal && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Confirmation</h3>
                            <p>Voulez-vous vraiment supprimer ce produit ?</p>
                            <div className="modal-action">
                                <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
                                <button className="btn btn-error" onClick={deleteProduit}>Confirmer</button>
                            </div>
                        </div>
                    </div>
                )}
    
                {/* Modal pour créer/modifier un produit */}
                <dialog id="produit_modal" className="modal">
                    <div className="modal-box max-w-4xl">
                        <h3 className="font-bold text-lg">
                            {editingProduit ? 'Modifier le produit' : 'Nouveau produit'}
                        </h3>
                        <div className="divider"></div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Code produit*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="code" 
                                        defaultValue={editingProduit?.code}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nom*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="nom" 
                                        defaultValue={editingProduit?.nom}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Catégorie*</span>
                                    </label>
                                    <select 
                                        name="categorie_id" 
                                        defaultValue={editingProduit?.categorie_id}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option disabled value="">Sélectionnez...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">TVA applicable</span>
                                        <input 
                                            type="checkbox" 
                                            name="tva_applicable" 
                                            defaultChecked={editingProduit?.tva_applicable ?? true}
                                            className="toggle toggle-primary" 
                                        />
                                    </label>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Taux TVA (%)</span>

                                    </label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        name="taux_tva" 
                                        defaultValue={editingProduit?.taux_tva}
                                        className="input input-bordered w-full" 
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Statut</span>
                                        <input 
                                            type="checkbox" 
                                            name="actif" 
                                            defaultChecked={editingProduit?.actif ?? true}
                                            className="toggle toggle-primary" 
                                        />
                                    </label>
                                </div>
                                
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Description</span>
                                    </label>
                                    <textarea 
                                        name="description" 
                                        defaultValue={editingProduit?.description}
                                        className="textarea textarea-bordered h-24 w-full" 
                                    />
                                </div>
                                
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Image</span>
                                    </label>
                                    <input 
                                        type="file" 
                                        name="image" 
                                        className="file-input file-input-bordered w-full" 
                                    />
                                    {editingProduit?.image && (
                                        <div className="mt-2">
                                            <img 
                                                src={`/storage/${editingProduit.image}`} 
                                                alt={editingProduit.nom}
                                                className="h-20 object-cover rounded-box"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {!editingProduit && (
                                <>
                                    <div className="divider">Informations initiales de prix (optionnel)</div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Prix d'achat</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="prix_achat" 
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Prix de vente détail</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="prix_detail" 
                                                className="input input-bordered w-full" 
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Quantité semi-gros</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                name="quantite_semi_gros" 
                                                defaultValue="4"
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Prix semi-gros</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="prix_semi_gros" 
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Quantité gros</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                name="quantite_gros" 
                                                defaultValue="10"
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Prix gros</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="prix_gros" 
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                    </div>

                                    <div className="divider">Stock initial (optionnel)</div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Rayon</span>
                                            </label>
                                            <select
                                                name="rayon_id"
                                                className="select select-bordered w-full"
                                            >
                                                <option disabled value="">Sélectionnez...</option>
                                                {rayons.map(rayon => (
                                                    <option key={rayon.id} value={rayon.id}>{rayon.nom}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Quantité initiale</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                name="stock_initial" 
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Seuil d'alerte</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                name="quantite_alerte" 
                                                defaultValue="10"
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            <div className="modal-action">
                                <button type="button" onClick={() => document.getElementById('produit_modal').close()} className="btn btn-ghost">
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduit ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => document.getElementById('produit_modal').close()}>close</button>
                    </form>
                </dialog>

                {/* Modal pour gérer les prix */}
                <dialog id="prix_modal" className="modal">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg">
                            Gestion des prix - {selectedProduit?.nom}
                        </h3>
                        <div className="divider"></div>
                        
                        <form onSubmit={handlePrixSubmit}>
                            <input type="hidden" name="produit_id" value={selectedProduit?.id} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Prix d'achat*</span>
                                    </label>
                                    <input 
                                        id="prix_achat"
                                        type="number" 
                                        step="0.01" 
                                        name="prix_achat" 
                                        defaultValue={initialPrixData.prix_achat}
                                        className="input input-bordered w-full" 
                                        required
                                        onChange={() => {
                                            const { marge, pourcentage } = calculateMarge();
                                            document.getElementById('marge_calc').textContent = 
                                                `Marge: ${marge.toLocaleString('fr-FR')} FC (${pourcentage}%)`;
                                        }}
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Prix de vente détail*</span>
                                    </label>
                                    <input 
                                        id="prix_detail"
                                        type="number" 
                                        step="0.01" 
                                        name="prix_detail" 
                                        defaultValue={initialPrixData.prix_detail}
                                        className="input input-bordered w-full" 
                                        required
                                        onChange={() => {
                                            const { marge, pourcentage } = calculateMarge();
                                            document.getElementById('marge_calc').textContent = 
                                                `Marge: ${marge.toLocaleString('fr-FR')} FC (${pourcentage}%)`;
                                        }}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <div className="text-sm text-info font-medium" id="marge_calc">
                                        Marge: 0 FC (0%)
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Quantité semi-gros*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="quantite_semi_gros" 
                                        defaultValue={initialPrixData.quantite_semi_gros}
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
                                        defaultValue={initialPrixData.prix_semi_gros}
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
                                        defaultValue={initialPrixData.quantite_gros}
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
                                        defaultValue={initialPrixData.prix_gros}
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
                                        defaultValue={initialPrixData.date_effet}
                                        className="input input-bordered w-full" 
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-action">
                                <button type="button" onClick={() => document.getElementById('prix_modal').close()} className="btn btn-ghost">
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        document.getElementById('prix_modal').close();
                                        setSelectedProduit(selectedProduit);
                                        setShowPrixManager(true);
                                    }}
                                >
                                    Historique complet
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => document.getElementById('prix_modal').close()}>close</button>
                    </form>
                </dialog>
    
                {/* Composant de gestion des prix */}
                {showPrixManager && (
                    <PrixManager
                        produit={selectedProduit}
                        prixProduits={prixProduits.filter(p => p.produit_id === selectedProduit.id)}
                        onClose={() => setShowPrixManager(false)}
                    />
                )}

                {/* Composant de gestion de stock */}
                {showStockManager && (
                    <StockManager 
                        produit={selectedProduit} 
                        rayons={rayons} 
                        stocks={stocks.filter(s => s.produit_id === selectedProduit.id)} 
                        onClose={() => setShowStockManager(false)}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}