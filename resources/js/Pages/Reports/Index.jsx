import React, { useState, useEffect } from 'react';
import Layout from '@/Layouts/AuthenticatedLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import RapportPreview from '@/Components/RapportPreview';
import { Head, usePage } from '@inertiajs/react';
const today = new Date().toISOString().split('T')[0]; // ex: '2025-05-12'
const Index = () => {
    const { auth, clients, rayons, categories, caisses, produits } = usePage().props;
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [typeRapport, setTypeRapport] = useState('ventes');
    const [format, setFormat] = useState('pdf');
    const [dateDebut, setDateDebut] = useState(today);
    const [dateFin, setDateFin] = useState(today);
    const [filtres, setFiltres] = useState({});
    
    const rapportOptions = [
        { value: 'ventes', label: 'Rapport des ventes' },
        { value: 'stock', label: 'État des stocks' },
        { value: 'mouvement_stock', label: 'Mouvements de stock' },
        { value: 'caisse', label: 'Mouvements de caisse' },
        { value: 'depenses', label: 'Dépenses' },
        { value: 'inventaires', label: 'Inventaires' },
        { value: 'clients', label: 'Clients' },
        { value: 'produits', label: 'Produits' },
    ];
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltres({ ...filtres, [name]: value });
    };
    
    const resetFiltres = () => {
        setFiltres({});
        setDateDebut('');
        setDateFin('');
    };
    
    const handleChangeTypeRapport = (e) => {
        setTypeRapport(e.target.value);
        resetFiltres();
    };
    
    const genererRapport = async () => {
        try {
            setLoading(true);
            
            // Ouvrir dans une nouvelle fenêtre/onglet
            window.open(`/rapports/generer?type_rapport=${typeRapport}&format=${format}&date_debut=${dateDebut}&date_fin=${dateFin}&filtres=${JSON.stringify(filtres)}`, '_blank');
            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Erreur lors de la génération du rapport");
            console.error(error);
        }
    };
    
    // Filtres spécifiques par type de rapport
    const renderFiltresSpecifiques = () => {
        switch (typeRapport) {
            case 'ventes':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Client</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="client_id"
                                value={filtres.client_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les clients</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Vendeur</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="user_id"
                                value={filtres.user_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les vendeurs</option>
                                {/* Remplacer par les données réelles des vendeurs */}
                                <option value="1">Vendeur 1</option>
                                <option value="2">Vendeur 2</option>
                            </select>
                        </div>
                    </>
                );
                
            case 'stock':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Rayon</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="rayon_id"
                                value={filtres.rayon_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les rayons</option>
                                {rayons.map(rayon => (
                                    <option key={rayon.id} value={rayon.id}>{rayon.nom}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Catégorie</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="categorie_id"
                                value={filtres.categorie_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(categorie => (
                                    <option key={categorie.id} value={categorie.id}>{categorie.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Niveau de stock</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="niveau_stock"
                                value={filtres.niveau_stock || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les niveaux</option>
                                <option value="alert">En alerte</option>
                                <option value="rupture">En rupture</option>
                            </select>
                        </div>
                    </>
                );
                
            case 'mouvement_stock':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Type de mouvement</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="type"
                                value={filtres.type || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les types</option>
                                <option value="entree">Entrée</option>
                                <option value="sortie">Sortie</option>
                                <option value="ajustement">Ajustement</option>
                                <option value="transfert">Transfert</option>
                            </select>
                        </div>
                        
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Produit</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="produit_id"
                                value={filtres.produit_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les produits</option>
                                {produits.map(produit => (
                                    <option key={produit.id} value={produit.id}>{produit.nom}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Rayon</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="rayon_id"
                                value={filtres.rayon_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les rayons</option>
                                {rayons.map(rayon => (
                                    <option key={rayon.id} value={rayon.id}>{rayon.nom}</option>
                                ))}
                            </select>
                        </div>
                    </>
                );
                
            case 'caisse':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Caisse</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="caisse_id"
                                value={filtres.caisse_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Toutes les caisses</option>
                                {caisses.map(caisse => (
                                    <option key={caisse.id} value={caisse.id}>{caisse.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Type de mouvement</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="type"
                                value={filtres.type || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les types</option>
                                <option value="entree">Entrée</option>
                                <option value="sortie">Sortie</option>
                            </select>
                        </div>
                    </>
                );
                
            case 'depenses':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Mode de paiement</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="mode_paiement"
                                value={filtres.mode_paiement || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les modes</option>
                                <option value="espece">Espèce</option>
                                <option value="carte">Carte</option>
                                <option value="cheque">Chèque</option>
                                <option value="mobile_money">Mobile Money</option>
                            </select>
                        </div>
                    </>
                );
                
            case 'inventaires':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Statut</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="statut"
                                value={filtres.statut || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les statuts</option>
                                <option value="planifie">Planifié</option>
                                <option value="encours">En cours</option>
                                <option value="termine">Terminé</option>
                                <option value="annule">Annulé</option>
                            </select>
                        </div>
                    </>
                );
                
            case 'clients':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Type de client</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="type"
                                value={filtres.type || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tous les types</option>
                                <option value="occasionnel">Occasionnel</option>
                                <option value="regulier">Régulier</option>
                                <option value="entreprise">Entreprise</option>
                            </select>
                        </div>
                    </>
                );
                
            case 'produits':
                return (
                    <>
                        <div className="form-control w-full md:w-1/3 mb-4">
                            <label className="label">
                                <span className="label-text">Catégorie</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                name="categorie_id"
                                value={filtres.categorie_id || ''}
                                onChange={handleFilterChange}
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(categorie => (
                                    <option key={categorie.id} value={categorie.id}>{categorie.name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <Layout>
            <Head title="Rapport" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gase-300 overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-6">Générateur de rapports</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Type de rapport</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full" 
                                    value={typeRapport}
                                    onChange={handleChangeTypeRapport}
                                >
                                    {rapportOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Format de sortie</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full" 
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="xlsx">Excel (XLSX)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Date de début</span>
                                </label>
                                <input 
                                    type="date" 
                                    className="input input-bordered w-full" 
                                    value={dateDebut}
                                    onChange={(e) => setDateDebut(e.target.value)}
                                />
                            </div>
                            
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Date de fin</span>
                                </label>
                                <input 
                                    type="date" 
                                    className="input input-bordered w-full" 
                                    value={dateFin}
                                    onChange={(e) => setDateFin(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="divider">Filtres spécifiques</div>
                        
                        <div className="flex flex-wrap -mx-2">
                            {renderFiltresSpecifiques()}
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button 
                                className="btn btn-outline" 
                                onClick={resetFiltres}
                            >
                                Réinitialiser
                            </button>
                            
                            <button 
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                onClick={genererRapport}
                                disabled={loading}
                            >
                                {loading ? 'En cours...' : 'Générer le rapport'}
                            </button>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button 
                                className="btn btn-outline" 
                                onClick={resetFiltres}
                            >
                                Réinitialiser
                            </button>
                            
                            <button 
                                className="btn btn-primary btn-outline"
                                onClick={() => setShowPreview(!showPreview)}
                            >
                                {showPreview ? 'Masquer l\'aperçu' : 'Afficher l\'aperçu'}
                            </button>
                            
                            <button 
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                onClick={genererRapport}
                                disabled={loading}
                            >
                                {loading ? 'En cours...' : 'Générer le rapport'}
                            </button>
                        </div>


                    </div>
                    {showPreview && (
                        <div className="mt-6">
                            <RapportPreview 
                                typeRapport={typeRapport}
                                dateDebut={dateDebut}
                                dateFin={dateFin}
                                filtres={filtres}
                            />
                        </div>
                    )}
                </div>
            </div>
            
            <ToastContainer />
        </Layout>
    );
};

export default Index;