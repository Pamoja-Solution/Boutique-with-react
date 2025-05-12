import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { LineChart, BarChart, PieChart } from 'react-chartkick';
import Chartkick from 'chartkick';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';



export default function UserStats({ auth, ventes, statsGlobales,depenses,stocks,valeurStock }) {
Chartkick.use(Chart);

    // États pour les filtres avec valeurs par défaut pour aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    const [filters, setFilters] = useState({
        dateDebut: today,
        dateFin: today,
        statut: 'tous',
        typeVente: 'tous',
        search: '',
        viewMode: 'day' // 'day', 'week', 'month', 'year'
    });
    // Préparer les données avec des valeurs par défaut

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedVente, setExpandedVente] = useState(null);
    
    // Filtrer les ventes
    const filteredVentes = ventes.filter(vente => {
        const matchesDate = (!filters.dateDebut || new Date(vente.created_at) >= new Date(filters.dateDebut)) &&
                          (!filters.dateFin || new Date(vente.created_at) <= new Date(filters.dateFin + 'T23:59:59'));
        
        const matchesStatut = filters.statut === 'tous' || vente.statut === filters.statut;
        const matchesSearch = !filters.search || 
                            vente.code.toLowerCase().includes(filters.search.toLowerCase()) ||
                            (vente.client && vente.client.name.toLowerCase().includes(filters.search.toLowerCase()));
        
        return matchesDate && matchesStatut && matchesSearch;
    });
    
    // Pagination
    const totalPages = Math.ceil(filteredVentes.length / itemsPerPage);
    const paginatedVentes = filteredVentes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    // Statistiques filtrées
    const filteredStats = {
        totalVentes: filteredVentes.length,
        totalHT: filteredVentes.reduce((sum, v) => sum + v.total_ht, 0),
        totalTVA: filteredVentes.reduce((sum, v) => sum + v.total_tva, 0),
        totalTTC: filteredVentes.reduce((sum, v) => sum + v.total_ttc, 0),
        totalRemise: filteredVentes.reduce((sum, v) => sum + v.montant_remise, 0),
        avgPanier: filteredVentes.length > 0 
            ? filteredVentes.reduce((sum, v) => sum + v.total_ttc, 0) / filteredVentes.length
            : 0,
        produitsVendus: filteredVentes.reduce((sum, v) => sum + v.articles_vente.reduce((s, a) => s + a.quantite, 0), 0)
    };
    // Préparer les données pour les graphiques
    const prepareChartData = () => {
        const ventesParJour = {};
        const ventesParCategorie = {};
        const ventesParStatut = {
            'Terminée': 0,
            'Annulée': 0,
            'En cours': 0
        };
        
        // Nouveaux graphiques
        const ventesParCategorieProduit = {};
        const produitsVendusParCategorie = {};
        const stocksParRayon = {};
        
        filteredVentes.forEach(vente => {
            // Ventes par jour
           // const date = new Date(vente.created_at).toLocaleDateString();
            const dateObj = new Date(vente.created_at);
const date = dateObj.getFullYear() + '-' +
             String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
             String(dateObj.getDate()).padStart(2, '0');

        
            ventesParJour[date] = (ventesParJour[date] || 0) + vente.total_ttc;
            
            // Ventes par statut
            if (vente.statut === 'terminee') ventesParStatut['Terminée'] += vente.total_ttc;
            else if (vente.statut === 'annulee') ventesParStatut['Annulée'] += vente.total_ttc;
            else ventesParStatut['En cours'] += vente.total_ttc;
            
            // Articles par catégorie (si les données sont disponibles)
            if (vente.articles_vente) {
                vente.articles_vente.forEach(article => {
                    const categorie = article.rayon?.nom || 'Autres';
                    ventesParCategorie[categorie] = (ventesParCategorie[categorie] || 0) + article.montant_ttc;
                    
                    // Nouveau: par catégorie de produit
                    const categorieProduit = article.produit?.categorie?.name || 'Non catégorisé';
                    ventesParCategorieProduit[categorieProduit] = (ventesParCategorieProduit[categorieProduit] || 0) + article.montant_ttc;
                    produitsVendusParCategorie[categorieProduit] = (produitsVendusParCategorie[categorieProduit] || 0) + article.quantite;
                });
            }
        });
        
        return {
            ventesParJour,
            ventesParCategorie,
            ventesParStatut,
            ventesParCategorieProduit, // Bien retourner cette variable
            produitsVendusParCategorie,
            stocksParRayon
        };
    };
    const { ventesParJour, ventesParCategorie, ventesParStatut,ventesParCategorieProduit = {}, // Valeur par défaut si non définie
    produitsVendusParCategorie = {},
    stocksParRayon = {} } = prepareChartData();
    
    // Créez un tableau trié par date
    const sortedData = Object.entries(ventesParJour)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .reduce((acc, [date, value]) => ({ ...acc, [date]: value }), {});

    // Gestion des changements de filtre
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };
    
    // Gestion du changement de période
    const handlePeriodChange = (period) => {
        const today = new Date();
        let dateDebut, dateFin;
        
        switch (period) {
            case 'today':
                dateDebut = dateFin = today.toISOString().split('T')[0];
                break;
            case 'week':
                const day = today.getDay();
                const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour dimanche
                dateDebut = new Date(today.setDate(diff)).toISOString().split('T')[0];
                dateFin = new Date(today.setDate(diff + 6)).toISOString().split('T')[0];
                break;
            case 'month':
                dateDebut = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                dateFin = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                break;
            case 'year':
                dateDebut = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                dateFin = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                break;
            default:
                dateDebut = dateFin = today.toISOString().split('T')[0];
        }
        
        setFilters(prev => ({ ...prev, dateDebut, dateFin, viewMode: period }));
    };
    
    // Voir les détails d'une vente
    const toggleVenteDetails = (venteId) => {
        setExpandedVente(expandedVente === venteId ? null : venteId);
    };
    
    // Exporter les données
    const exportData = () => {
        router.post(route('stats.export'), { filters });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Les Statistiques" />
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Les Statistiques de Vente</h1>
                
                {/* Boutons de période rapide */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button 
                        onClick={() => handlePeriodChange('today')}
                        className={`btn ${filters.viewMode === 'today' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Aujourd'hui
                    </button>
                    <button 
                        onClick={() => handlePeriodChange('week')}
                        className={`btn ${filters.viewMode === 'week' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Cette semaine
                    </button>
                    <button 
                        onClick={() => handlePeriodChange('month')}
                        className={`btn ${filters.viewMode === 'month' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Ce mois
                    </button>
                    <button 
                        onClick={() => handlePeriodChange('year')}
                        className={`btn ${filters.viewMode === 'year' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Cette année
                    </button>
                </div>
                
                {/* Filtres */}
                <div className="bg-base-200 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Filtres avancés</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date de début</span>
                            </label>
                            <input 
                                type="date" 
                                name="dateDebut"
                                value={filters.dateDebut}
                                onChange={handleFilterChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date de fin</span>
                            </label>
                            <input 
                                type="date" 
                                name="dateFin"
                                value={filters.dateFin}
                                onChange={handleFilterChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Statut</span>
                            </label>
                            <select 
                                name="statut"
                                value={filters.statut}
                                onChange={handleFilterChange}
                                className="select select-bordered w-full"
                            >
                                <option value="tous">Tous</option>
                                <option value="terminee">Terminée</option>
                                <option value="annulee">Annulée</option>
                                <option value="encours">En cours</option>
                            </select>
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Recherche</span>
                            </label>
                            <input 
                                type="text" 
                                name="search"
                                placeholder="N° facture, client..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stats bg-primary text-primary-content shadow">
                        <div className="stat">
                            <div className="stat-title">Total Ventes</div>
                            <div className="stat-value">{filteredStats.totalVentes}</div>
                            <div className="stat-desc">Transactions</div>
                        </div>
                    </div>
                    
                    <div className="stats bg-secondary text-secondary-content shadow">
                        <div className="stat">
                            <div className="stat-title">Chiffre d'affaires</div>
                            <div className="stat-value">{filteredStats.totalTTC.toLocaleString('fr-FR')} FC</div>
                            <div className="stat-desc">TTC</div>
                        </div>
                    </div>
                    
                    <div className="stats bg-accent text-accent-content shadow">
                        <div className="stat">
                            <div className="stat-title">Panier moyen</div>
                            <div className="stat-value">{filteredStats.avgPanier.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} FC</div>
                            <div className="stat-desc">Par transaction</div>
                        </div>
                    </div>
                    
                    <div className="stats bg-neutral text-neutral-content shadow">
                        <div className="stat">
                            <div className="stat-title">Produits vendus</div>
                            <div className="stat-value">{filteredStats.produitsVendus}</div>
                            <div className="stat-desc">Articles</div>
                        </div>
                    </div>
                </div>
                
                {/* Deuxième ligne de stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="stats bg-base-200 shadow">
                        <div className="stat">
                            <div className="stat-title">Montant HT</div>
                            <div className="stat-value">{filteredStats.totalHT.toLocaleString('fr-FR')} FC</div>
                            <div className="stat-desc">Hors taxes</div>
                        </div>
                    </div>
                    
                    <div className="stats bg-base-200 shadow">
                        <div className="stat">
                            <div className="stat-title">TVA Collectée</div>
                            <div className="stat-value">{filteredStats.totalTVA.toLocaleString('fr-FR')} FC</div>
                            <div className="stat-desc">Total TVA</div>
                        </div>
                    </div>
                    
                    <div className="stats bg-base-200 shadow">
                        <div className="stat">
                            <div className="stat-title">Remises accordées</div>
                            <div className="stat-value">{filteredStats.totalRemise.toLocaleString('fr-FR')} FC</div>
                            <div className="stat-desc">Total remises</div>
                        </div>
                    </div>
                </div>
                
                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-base-200 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Évolution des ventes</h2>
                        <div className="h-80">
                            <LineChart 
                                data={sortedData} 
                                colors={["#3b82f6"]}
                                library={{
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }}
                                suffix=" FC"
                            />
                        </div>
                    </div>
                    
                    <div className="bg-base-200 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Répartition par catégorie</h2>
                        <div className="h-80">
                            {Object.keys(ventesParCategorie).length > 0 ? (
                                <PieChart 
                                    data={ventesParCategorie} 
                                    donut={true}
                                    library={{
                                        plugins: {
                                            legend: {
                                                position: 'right'
                                            }
                                        }
                                    }}
                                    suffix=" FC"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Aucune donnée disponible
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Nouvelle section de graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Ventes par catégorie de produit */}
                    <div className="bg-base-200 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Ventes par catégorie de produit</h2>
                        <div className="h-80">
                            {Object.keys(ventesParCategorieProduit).length > 0 ? (
                                <BarChart 
                                    data={ventesParCategorieProduit} 
                                    colors={["#10b981"]}
                                    library={{
                                        indexAxis: 'y',
                                        scales: {
                                            x: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                    suffix=" FC"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Aucune donnée disponible
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Produits vendus par catégorie */}
                    <div className="bg-base-200 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Quantités vendues par catégorie</h2>
                        <div className="h-80">
                            {Object.keys(produitsVendusParCategorie).length > 0 ? (
                                <PieChart 
                                    data={produitsVendusParCategorie} 
                                    donut={true}
                                    colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
                                    suffix=" unités"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Aucune donnée disponible
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Dépenses */}
                <div className="bg-base-200 p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Mes Dépenses</h2>
                    
                    {depenses && depenses.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="stats bg-error text-error-content">
                                    <div className="stat">
                                        <div className="stat-title">Total Dépenses</div>
                                        <div className="stat-value">{depenses.reduce((sum, d) => sum + d.montant_converti, 0).toLocaleString('fr-FR')} FC</div>
                                    </div>
                                </div>
                                
                                <div className="stats bg-warning text-warning-content">
                                    <div className="stat">
                                        <div className="stat-title">Moyenne par jour</div>
                                        <div className="stat-value">{(depenses.reduce((sum, d) => sum + d.montant_converti, 0) / depenses.length).toLocaleString('fr-FR', {maximumFractionDigits: 2})} FC</div>
                                    </div>
                                </div>
                                
                                <div className="stats bg-info text-info-content">
                                    <div className="stat">
                                        <div className="stat-title">Mode de paiement favori</div>
                                        <div className="stat-value">
                                            {(() => {
                                                const modes = {};
                                                depenses.forEach(d => modes[d.mode_paiement] = (modes[d.mode_paiement] || 0) + 1);
                                                return Object.keys(modes).reduce((a, b) => modes[a] > modes[b] ? a : b);
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Montant</th>
                                            <th>Mode paiement</th>
                                            <th>Bénéficiaire</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {depenses.slice(0, 5).map(depense => (
                                            <tr key={depense.id}>
                                                <td>{new Date(depense.date_depense).toLocaleDateString('fr-FR')}</td>
                                                <td>{depense.description}</td>
                                                <td>{depense.montant_converti.toLocaleString('fr-FR')} FC</td>
                                                <td>
                                                    <span className="badge badge-outline capitalize">
                                                        {depense.mode_paiement}
                                                    </span>
                                                </td>
                                                <td>{depense.beneficiaire || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {depenses.length > 5 && (
                                <div className="text-center mt-4">
                                    <button className="btn btn-sm btn-ghost">
                                        Voir toutes les dépenses ({depenses.length})
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Aucune dépense enregistrée pour cette période
                        </div>
                    )}
                </div>
                {/* Liste des ventes */}
                <div className="bg-base-100 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">Historique des ventes</h2>
                        <div className="flex items-center gap-2">
                            <div className=""><span className="text-sm">Afficher :</span></div>
                            <div className="">
                                <select 
                                className="select select-bordered select-md"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select></div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>N° Facture</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th className="text-right">Montant TTC</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedVentes.length > 0 ? (
                                    paginatedVentes.map(vente => (
                                        <React.Fragment key={vente.id}>
                                            <tr>
                                                <td>{vente.code}</td>
                                                <td>{vente.client?.name || 'Non spécifié'}</td>
                                                <td>{new Date(vente.created_at).toLocaleDateString('fr-FR')}</td>
                                                <td className="text-right">{vente.total_ttc.toLocaleString('fr-FR')} FC</td>
                                                <td>
                                                    <span className={`badge ${
                                                        vente.statut === 'terminee' ? 'badge-success' : 
                                                        vente.statut === 'annulee' ? 'badge-error' : 'badge-warning'
                                                    }`}>
                                                        {vente.statut === 'terminee' ? 'Terminée' : 
                                                         vente.statut === 'annulee' ? 'Annulée' : 'En cours'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        onClick={() => toggleVenteDetails(vente.id)}
                                                        className="btn btn-sm btn-ghost"
                                                    >
                                                        {expandedVente === vente.id ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            
                                            {expandedVente === vente.id && (
                                                <tr>
                                                    <td colSpan="6" className="bg-base-200 p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h3 className="font-semibold mb-2">Détails de la vente</h3>
                                                                <div className="space-y-1">
                                                                    <p><span className="font-medium">HT:</span> {vente.total_ht.toLocaleString('fr-FR')} FC</p>
                                                                    <p><span className="font-medium">TVA:</span> {vente.total_tva.toLocaleString('fr-FR')} FC</p>
                                                                    <p><span className="font-medium">Remise:</span> {vente.montant_remise.toLocaleString('fr-FR')} FC</p>
                                                                    <p><span className="font-medium">Payé:</span> {vente.montant_paye.toLocaleString('fr-FR')} FC</p>
                                                                    {vente.notes && <p><span className="font-medium">Notes:</span> {vente.notes}</p>}
                                                                </div>
                                                            </div>
                                                            
                                                            <div>
                                                                <h3 className="font-semibold mb-2">Articles ({vente.articles_vente?.length || 0})</h3>
                                                                <div className="overflow-x-auto">
                                                                    <table className="table table-xs">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Produit</th>
                                                                                <th>Qté</th>
                                                                                <th>Prix</th>
                                                                                <th>Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {vente.articles_vente?.map(article => (
                                                                                <tr key={article.id}>
                                                                                    <td>{article.produit?.nom || 'N/A'}</td>
                                                                                    <td>{article.quantite}</td>
                                                                                    <td>{article.prix_unitaire.toLocaleString('fr-FR')} FC</td>
                                                                                    <td>{article.montant_ttc.toLocaleString('fr-FR')} FC</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-gray-500">Aucune vente trouvée pour cette période</p>
                                                <button 
                                                    onClick={() => setFilters({
                                                        dateDebut: '',
                                                        dateFin: '',
                                                        statut: 'tous',
                                                        typeVente: 'tous',
                                                        search: '',
                                                        viewMode: 'all'
                                                    })}
                                                    className="btn btn-sm btn-ghost mt-2"
                                                >
                                                    Réinitialiser les filtres
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center p-4 border-t">
                            <div>
                                <span className="text-sm text-gray-600">
                                    Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredVentes.length)} sur {filteredVentes.length} ventes
                                </span>
                            </div>
                            <div className="join">
                                <button 
                                    className="join-item btn btn-sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
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
                                            className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button 
                                    className="join-item btn btn-sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section Stocks */}
                    <div className="bg-base-200 p-6 rounded-lg shadow mb-8">
                        <h2 className="text-xl font-semibold mb-4">État des Stocks</h2>
                        
                        {stocks && stocks.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="stats bg-base-100">
                                        <div className="stat">
                                            <div className="stat-title">Produits en stock</div>
                                            <div className="stat-value">{stocks.length}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="stats bg-base-100">
                                        <div className="stat">
                                            <div className="stat-title">Produits en alerte</div>
                                            <div className="stat-value">{stocks.filter(s => s.quantite <= s.quantite_alerte).length}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="stats bg-base-100">
                                        <div className="stat">
                                            <div className="stat-title">Valeur totale du stock</div>
                                            <div className="stat-value">{valeurStock.toLocaleString('fr-FR')}
                                            FC</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Produit</th>
                                                <th>Catégorie</th>
                                                <th>Rayon</th>
                                                <th>Quantité</th>
                                                <th>Niveau</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stocks.slice(0, 5).map(stock => (
                                                <tr key={stock.id}>
                                                    <td>{stock.produit.nom}</td>
                                                    <td>{stock.produit.categorie.name}</td>
                                                    <td>{stock.rayon.nom}</td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            {stock.quantite}
                                                            {stock.quantite <= stock.quantite_alerte && (
                                                                <span className="badge badge-error">Alerte</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <progress 
                                                            className={`progress ${
                                                                stock.quantite <= stock.quantite_alerte ? 'progress-error' : 
                                                                stock.quantite <= stock.quantite_alerte * 2 ? 'progress-warning' : 'progress-success'
                                                            }`} 
                                                            value={stock.quantite} 
                                                            max={stock.quantite_alerte * 3}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {stocks.length > 5 && (
                                    <div className="text-center mt-4">
                                        <button className="btn btn-sm btn-ghost" onClick={()=>document.getElementById('my_modal_4').showModal()}>
                                            Voir tous les stocks ({stocks.length})
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Aucune information de stock disponible
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Modal autres stocks document.getElementById('ID').showModal() method */}
                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">Tout les Stocks!</h3>
                        <p className="py-4">Une Apperçu Statistique</p>
                        <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Produit</th>
                                                <th>Catégorie</th>
                                                <th>Rayon</th>
                                                <th>Quantité</th>
                                                <th>Niveau</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stocks.map(stock => (
                                                <tr key={stock.id}>
                                                    <td>{stock.produit.nom}</td>
                                                    <td>{stock.produit.categorie.name}</td>
                                                    <td>{stock.rayon.nom}</td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            {stock.quantite}
                                                            {stock.quantite <= stock.quantite_alerte && (
                                                                <span className="badge badge-error">Alerte</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <progress 
                                                            className={`progress ${
                                                                stock.quantite <= stock.quantite_alerte ? 'progress-error' : 
                                                                stock.quantite <= stock.quantite_alerte * 2 ? 'progress-warning' : 'progress-success'
                                                            }`} 
                                                            value={stock.quantite} 
                                                            max={stock.quantite_alerte * 3}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                        <div className="modal-action">
                            
                        <form method="dialog">
                            {/* if there is a button, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            <button className="btn">Close</button>
                        </form>
                        </div>
                    </div>
                </dialog>
                {/* Boutons d'action */}
                <div className="flex justify-between items-center">
                    <button 
                        onClick={() => window.print()}
                        className="btn btn-outline"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimer
                    </button>
                    
                    <button 
                        onClick={exportData}
                        className="btn btn-primary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exporter les données
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}