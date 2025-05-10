import React, { useState, useEffect } from 'react';
import { router } from "@inertiajs/react";
import { debounce } from 'lodash';
import { toast } from 'react-hot-toast';

export default function ProduitSearch({ onSelectProduit }) {
    const [search, setSearch] = useState('');
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quantite, setQuantite] = useState(1);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [scanMode, setScanMode] = useState(false);
    const [typeVente, setTypeVente] = useState('detail');
    const [rayonSelectionne, setRayonSelectionne] = useState(null);
   
    // Recherche avec debounce
    // Recherche avec debounce
    const debouncedSearch = debounce((term) => {
        if (term.length > 2) {
            setLoading(true);
            router.get(route('point-de-vente.search-produits'), { search: term }, {
                preserveState: true,
                onSuccess: (page) => {
                    setProduits(page.props.produits || []);
                    setLoading(false);
                    
                    if (scanMode && page.props.produits.length === 1) {
                        setSelectedProduit(page.props.produits[0]);
                        setScanMode(false);
                    }
                },
                onError: () => {
                    setLoading(false);
                    setScanMode(false);
                }
            });
        } else {
            setProduits([]);
        }
    }, 300);

    useEffect(() => {
        debouncedSearch(search);
        return () => debouncedSearch.cancel();
    }, [search]);


    useEffect(() => {
        debouncedSearch(search);
        return () => debouncedSearch.cancel();
    }, [search]);
    
    useEffect(() => {
        if (selectedProduit) {
            // Sélectionner automatiquement le rayon avec le plus de stock
            const rayonPlusDispo = [...selectedProduit.rayons].sort((a, b) => b.quantite - a.quantite)[0];
            setRayonSelectionne(rayonPlusDispo);
            
            // Réinitialiser le type de vente
            setTypeVente('detail');
        }
    }, [selectedProduit]);

    const getPrixParType = (type, produit) => {
        switch(type) {
            case 'gros': return produit.prix_gros;
            case 'semi_gros': return produit.prix_semi_gros;
            default: return produit.prix_detail;
        }
    };
    // Dans ProduitSearch.jsx
    const handleAddToCart = () => {
        if (!selectedProduit || !rayonSelectionne) return;
        
        if (quantite > rayonSelectionne.quantite) {
            toast.error(`Stock insuffisant. Seulement ${rayonSelectionne.quantite} disponible(s)`);
            return;
        }
    
        // Déterminer le prix en fonction du type de vente
        const prixUnitaire = getPrixParType(typeVente, selectedProduit);
        
        // Appeler onSelectProduit avec tous les paramètres nécessaires
        onSelectProduit(selectedProduit, quantite, typeVente, prixUnitaire, rayonSelectionne);
        
        setSelectedProduit(null);
        setQuantite(1);
        setSearch('');
    };



    const handleScan = () => {
        setScanMode(true);
        // Focus sur le champ de recherche
        document.getElementById('produit-search').focus();
    };
    
    const handleKeyDown = (e) => {
        // Si Enter est pressé en mode scan et qu'un produit est sélectionné
        if (scanMode && e.key === 'Enter' && selectedProduit) {
            handleAddToCart();
        }
    };

    return (
        <div className="card bg-base-100 shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Produits</h2>
                <button 
                    onClick={handleScan}
                    className={`btn btn-sm ${scanMode ? 'btn-primary' : 'btn-outline'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Scanner
                </button>
            </div>

            <div className="relative mb-2">
                <input
                    id="produit-search"
                    type="text"
                    placeholder={scanMode ? "Scanner le code barre..." : "Rechercher un produit..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input input-bordered w-full pr-10"
                    autoComplete="off"
                />
                {loading && (
                    <div className="absolute right-3 top-3">
                        <span className="loading loading-spinner loading-xs"></span>
                    </div>
                )}
            </div>

            {selectedProduit ? (
                <div className="bg-base-200 p-4 rounded mt-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{selectedProduit.nom}</p>
                            <p className="text-sm text-gray-500">Code: {selectedProduit.code}</p>
                            
                            {/* Sélection du type de vente */}
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                <div 
                                    className={`p-2 rounded text-xs text-center cursor-pointer ${typeVente === 'detail' ? 'bg-primary text-white' : 'bg-base-100'}`}
                                    onClick={() => setTypeVente('detail')}
                                >
                                    <div className="text-gray-500">Prix Détail</div>
                                    <div className="font-semibold">{selectedProduit.prix_detail} FC</div>
                                </div>
                                <div 
                                    className={`p-2 rounded text-xs text-center cursor-pointer ${typeVente === 'semi_gros' ? 'bg-primary text-white' : 'bg-base-100'}`}
                                    onClick={() => setTypeVente('semi_gros')}
                                >
                                    <div className="text-gray-500">Semi-Gros</div>
                                    <div className="font-semibold">{selectedProduit.prix_semi_gros} FC</div>
                                </div>
                                <div 
                                    className={`p-2 rounded text-xs text-center cursor-pointer ${typeVente === 'gros' ? 'bg-primary text-white' : 'bg-base-100'}`}
                                    onClick={() => setTypeVente('gros')}
                                >
                                    <div className="text-gray-500">Gros</div>
                                    <div className="font-semibold">{selectedProduit.prix_gros} FC</div>
                                </div>
                            </div>

                            {/* Sélection du rayon */}
                            <div className="mt-4">
                                <label className="label label-text">Rayon</label>
                                <select
                                    value={rayonSelectionne?.id || ''}
                                    onChange={(e) => {
                                        const rayonId = e.target.value;
                                        const rayon = selectedProduit.rayons.find(r => r.id == rayonId);
                                        setRayonSelectionne(rayon);
                                    }}
                                    className="select select-bordered w-full"
                                >
                                    {selectedProduit.rayons.map((rayon, index) => (
                                        <option key={`${rayon.id}-${index}`} value={rayon.id}>
                                            {rayon.nom} ({rayon.quantite} dispo)
                                        </option>
                                    ))}


                                </select>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedProduit(null)}
                            className="btn btn-sm btn-circle"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Quantité */}
                    <div className="mt-4">
                        <label className="label label-text">Quantité</label>
                        <input
                            type="number"
                            min="1"
                            value={quantite}
                            onChange={(e) => setQuantite(Math.max(1, parseInt(e.target.value) || 1))}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Résumé */}
                    <div className="mt-4 bg-base-100 p-3 rounded">
                        <div className="flex justify-between">
                            <span>Prix unitaire:</span>
                            <span className="font-semibold">
                                {getPrixParType(typeVente, selectedProduit).toFixed(2)} FC
                            </span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Total:</span>
                            <span className="font-semibold text-primary">
                                {(getPrixParType(typeVente, selectedProduit) * quantite).toFixed(2)} FC
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="btn btn-primary w-full mt-4"
                    >
                        Ajouter au panier
                    </button>
                </div>
            ) : (
                search.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto divide-y">
                        {produits.length > 0 ? (
                            produits.map(produit => (
                                <div
                                    key={produit.id}
                                    onClick={() => setSelectedProduit(produit)}
                                    className="p-2 hover:bg-base-300 cursor-pointer"
                                >
                                    <div className="flex justify-between">
                                        <p className="font-medium">{produit.nom}</p>
                                        <p className="text-primary font-semibold">{produit.prix_detail} FC</p>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Ref: {produit.code}</span>
                                        <span className={produit.stock_total > 0 ? 'text-success' : 'text-error'}>
                                            {produit.stock_total} en stock
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            search.length > 2 && !loading && (
                                <div className="text-center py-4 text-gray-500">
                                    Aucun produit trouvé
                                </div>
                            )
                        )}
                    </div>
                )
            )}
        </div>
    );
}