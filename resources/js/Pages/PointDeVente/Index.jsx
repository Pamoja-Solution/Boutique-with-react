import React, { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import PanierItem from '@/Components/PanierItem';
import ClientSearch from '@/Components/ClientSearch';
import ProduitSearch from '@/Components/ProduitSearch';
import { toast } from 'react-hot-toast';

export default function PointDeVente({ rayons, clientsInitiaux, flash }) {
    const [panier, setPanier] = useState([]);
    const [client, setClient] = useState(null);
    const [montantPaye, setMontantPaye] = useState('');
    const [monnaieRendue, setMonnaieRendue] = useState(0);
    const [processing, setProcessing] = useState(false);

    // Afficher les messages flash
    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Calcul du total et des statistiques
    const stats = useMemo(() => {
       // const totalHT = panier.reduce((sum, item) => sum + item.montant_ht, 0);
        const totalHT = panier.reduce((sum, item) => sum + item.montant_ht, 0);
        const totalTVA = panier.reduce((sum, item) => {
            return sum + (item.tva_applicable ? item.montant_ht * (item.taux_tva / 100) : 0);
        }, 0);
        //const totalTVA = panier.reduce((sum, item) => sum + item.montant_tva, 0);
        const totalTTC = panier.reduce((sum, item) => sum + item.montant_ttc, 0);
        const nbArticles = panier.length;
        const nbProduits = panier.reduce((sum, item) => sum + item.quantite, 0);
        
        return { totalHT, totalTVA, totalTTC, nbArticles, nbProduits };
    }, [panier]);

    // Mise à jour de la monnaie rendue
    useEffect(() => {
        setMonnaieRendue(montantPaye ? (parseFloat(montantPaye) - stats.totalTTC) : 0);
    }, [montantPaye, stats.totalTTC]);

    // Ajouter un produit au panier
    const ajouterAuPanier = (produit, quantite, typeVente, prixUnitaire, rayon) => {
        if (!rayon) {
            console.error("Rayon non défini pour le produit", produit);
            return toast.error("Erreur: Aucun rayon sélectionné");
        }
    
        const stockDispo = rayon.quantite;
        
        if (quantite > stockDispo) {
            return toast.error(`Stock insuffisant. Seulement ${stockDispo} disponible.`);
        }
    
    
         // Arrondir le prix unitaire à 2 décimales
        prixUnitaire = parseFloat(prixUnitaire.toFixed(2));
        
        
        const montantHT = parseFloat((prixUnitaire * quantite).toFixed(2));
        const tauxTVA = produit.tva_applicable ? (produit.taux_tva / 100) : 0;
        const montantTVA = parseFloat((montantHT * tauxTVA).toFixed(2));
        const montantTTC = parseFloat((montantHT + montantTVA).toFixed(2));

        
        // Vérifier si le produit est déjà dans le panier
        const existingIndex = panier.findIndex(
            item => item.produit_id === produit.id && 
                   item.rayon_id === rayon.id &&
                   item.type_vente === typeVente
        );
    
       // Dans ajouterAuPanier, remplacez la partie de mise à jour par :
        if (existingIndex !== -1) {
            const newPanier = [...panier];
            const newQuantite = newPanier[existingIndex].quantite + quantite;
            
            if (newQuantite > stockDispo) {
                return toast.error(`Stock insuffisant. Seulement ${stockDispo} disponible.`);
            }
            
            const newMontantHT = parseFloat((prixUnitaire * newQuantite).toFixed(2));
            const newMontantTVA = produit.tva_applicable 
                ? parseFloat((newMontantHT * (produit.taux_tva / 100)).toFixed(2))
                : 0;
            
            newPanier[existingIndex] = {
                ...newPanier[existingIndex],
                quantite: newQuantite,
                montant_ht: newMontantHT,
                montant_tva: newMontantTVA,
                montant_ttc: parseFloat((newMontantHT + newMontantTVA).toFixed(2))
            };
            
            setPanier(newPanier);
            toast.success(`Quantité augmentée à ${newQuantite}`);
        } else {
            // Ajouter un nouvel article
            setPanier(prev => [
                ...prev,
                {
                    produit_id: produit.id,
                    produit_nom: produit.nom,
                    produit_code: produit.code,
                    rayon_id: rayon.id,
                    rayon_nom: rayon.nom,
                    quantite: quantite,
                    tva_applicable:produit.tva_applicable,
                    taux_tva:produit.taux_tva,
                    prix_unitaire: prixUnitaire,
                    montant_ht: montantHT,
                    montant_tva: montantTVA,
                    montant_ttc: montantTTC,
                    type_vente: typeVente,
                    stock_disponible: stockDispo
                }
            ]);
            toast.success(`${produit.nom} ajouté au panier`);
        }
    };

    // Supprimer un article du panier
    const supprimerDuPanier = (index) => {
        setPanier(prev => prev.filter((_, i) => i !== index));
        toast.success('Article retiré du panier');
    };

    // Modifier la quantité d'un article
    const modifierQuantite = (index, nouvQte) => {
        if (nouvQte <= 0) return supprimerDuPanier(index);
    
        const newPanier = [...panier];
        //const item = {...newPanier[index]};
        const item = panier[index];
        
        // Vérifier le stock
        if (nouvQte > item.stock_disponible) {
            return toast.error(`Stock insuffisant. Seulement ${item.stock_disponible} disponible.`);
        }
        
        // Ne pas recalculer le prix unitaire - garder celui d'origine
        //const item = panier[index];
        const montantHT = parseFloat((item.prix_unitaire * nouvQte).toFixed(2));
        const tauxTVA = item.tva_applicable ? (item.taux_tva / 100) : 0;
        const montantTVA = parseFloat((montantHT * tauxTVA).toFixed(2));
        const montantTTC = parseFloat((montantHT + montantTVA).toFixed(2));

        newPanier[index] = {
            ...item,
            quantite: nouvQte,
            montant_ht: montantHT,
            montant_tva: montantTVA,
            montant_ttc: montantTTC
        };
        
        setPanier(newPanier);
    };

    // Valider la vente
    const validerVente = () => {
        if (panier.length === 0) {
            return toast.error('Le panier est vide');
        }
        
        const totalTTC = stats.totalTTC.toFixed(2);
        
    
        setProcessing(true);
        
        router.post(route('point-de-vente.process'), {
            client,
            articles: panier.map(item => ({
                produit_id: item.produit_id,
                rayon_id: item.rayon_id,
                taux_tva:item.taux_tva,
                quantite: item.quantite,
                montant_ht: item.montant_ht,
                montant_tva: item.montant_tva,
                montant_ttc: item.montant_ttc,
                type_vente: item.type_vente,

                prix_unitaire: parseFloat(item.prix_unitaire.toFixed(2)),
            })),
            type_vente: "details",

            montant_paye: panier.reduce((sum, item) => sum + item.montant_ttc, 0)//parseFloat(parseFloat(montantPaye).toFixed(2))
        }, {
            onSuccess: (page) => {
                setProcessing(false);
                // Ouvrir le ticket dans un nouvel onglet
                if (page.props.vente?.id) {
                    window.open(route('ventes.ticket', page.props.vente.id), '_blank');
                }
                // Réinitialiser le formulaire
                setPanier([]);
                setClient(null);
                setMontantPaye('');
                toast.success('Vente enregistrée avec succès');
            },
            onError: (errors) => {
                setProcessing(false);
                Object.values(errors).forEach(error => {

                    toast.error(error);
                    toast.error("Aucun Client séléctionné");

                });
            }
        });
    };

    // Réinitialiser la vente
    const reinitialiserVente = () => {
        if (panier.length > 0 && !confirm('Voulez-vous vraiment annuler cette vente?')) {
            return;
        }
        setPanier([]);
        setClient(null);
        setMontantPaye('');
        toast.success('Vente réinitialisée');
    };

    // Fonctions helpers
    const determinerTypeVente = (quantite, produit) => {
        const qteGros = 10; // À adapter selon votre logique
        const qteSemiGros = 5; // À adapter selon votre logique
        
        if (quantite >= qteGros) return 'gros';
        if (quantite >= qteSemiGros) return 'semi_gros';
        return 'detail';
    };

    const getPrixParType = (type, produit) => {
        switch(type) {
            case 'gros': return produit.prix_gros || 0;
            case 'semi_gros': return produit.prix_semi_gros || 0;
            default: return produit.prix_detail || 0;
        }
    };
   
    return (
        <Layout>
            <Head title="Point de Vente" />
            
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Point de Vente</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={reinitialiserVente}
                        className="btn btn-outline"
                    >
                        Nouvelle vente
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne gauche - Recherche */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Sélection de rayon */}
                    
                    {/* Recherche de produit */}
                    <ProduitSearch 
                        onSelectProduit={(produit, quantite, typeVente, prixUnitaire, rayon) => 
                            ajouterAuPanier(produit, quantite, typeVente, prixUnitaire, rayon)
                        }
                    />
                    
                    {/* Recherche de client */}
                    <ClientSearch 
                        clientsInitiaux={clientsInitiaux}
                        onSelectClient={setClient}
                        selectedClient={client}
                    />
                </div>
                
                {/* Colonne droite - Panier */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card bg-base-100 shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Panier</h2>
                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-title">Articles</div>
                                    <div className="stat-value text-primary">{stats.nbArticles}</div>
                                </div>
                            </div>
                        </div>
                        
                        {panier.length === 0 ? (
                            <div className="bg-base-200 p-8 text-center rounded-md">
                                <span className="text-4xl">🛒</span>
                                <p className="text-gray-500 mt-2">Aucun article dans le panier</p>
                                <p className="text-sm">Recherchez et ajoutez des produits pour commencer</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* En-tête du panier */}
                                <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
                                    <div className="col-span-5">Produit</div>
                                    <div className="col-span-2 text-center">Prix unit.</div>
                                    <div className="col-span-2 text-center">Qté</div>
                                    <div className="col-span-2 text-right">Total</div>
                                    <div className="col-span-1"></div>
                                </div>
                                
                                {/* Liste des articles */}
                                <div className="space-y-3 max-h-96 overflow-y-auto bg-base-200 px-1 py-1">
                                    {panier.map((item, index) => (
                                        <PanierItem
                                            key={index}
                                            item={item}
                                            onRemove={() => supprimerDuPanier(index)}
                                            onQuantityChange={(qty) => modifierQuantite(index, qty)}
                                        />
                                    ))}
                                </div>
                                
                                {/* Récapitulatif */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Total HT:</span>
                                        <span>{stats.totalHT.toFixed(2)} FC</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>TVA:</span>
                                        <span>{stats.totalTVA.toFixed(2)} FC</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total TTC:</span>
                                        <span>{stats.totalTTC.toFixed(2)} FC</span>
                                    </div>
                                </div>
                                
                                {/* Paiement */}
                                <div className="divider">Paiement</div>
                                
                                
                                <button
                                    onClick={validerVente}
                                    disabled={processing || monnaieRendue < 0}
                                    className="btn btn-success w-full mt-6"
                                >
                                    {processing ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Valider la Vente"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}