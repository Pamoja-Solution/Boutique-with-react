import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function VendeurStats({ auth, vendeurs, selectedVendeur, ventes, stats, filters }) {
    const [periode, setPeriode] = useState(filters.periode || 'today');
    const [dateDebut, setDateDebut] = useState(filters.date_debut || format(new Date(), 'yyyy-MM-dd'));
    const [dateFin, setDateFin] = useState(filters.date_fin || format(new Date(), 'yyyy-MM-dd'));
    const [selectedVente, setSelectedVente] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePeriodeChange = (newPeriode) => {
        setPeriode(newPeriode);
        
        const today = new Date();
        switch (newPeriode) {
            case 'today':
                setDateDebut(format(today, 'yyyy-MM-dd'));
                setDateFin(format(today, 'yyyy-MM-dd'));
                break;
            case 'yesterday':
                const yesterday = subDays(today, 1);
                setDateDebut(format(yesterday, 'yyyy-MM-dd'));
                setDateFin(format(yesterday, 'yyyy-MM-dd'));
                break;
            case 'month':
                setDateDebut(format(startOfMonth(today), 'yyyy-MM-dd'));
                setDateFin(format(endOfMonth(today), 'yyyy-MM-dd'));
                break;
        }
        
        reloadData(newPeriode);
    };

    const reloadData = (newPeriode = periode) => {
        if (!selectedVendeur) return;
        
        const params = {
            vendeur_id: selectedVendeur.id,
            periode: newPeriode,
        };
        
        if (newPeriode === 'custom') {
            params.date_debut = dateDebut;
            params.date_fin = dateFin;
        }
        
        router.get(route('stats.vendeurs'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleVendeurSelect = (vendeur) => {
        router.get(route('stats.vendeurs'), {
            vendeur_id: vendeur.id,
            periode,
            date_debut: periode === 'custom' ? dateDebut : undefined,
            date_fin: periode === 'custom' ? dateFin : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const openVenteDetails = (vente) => {
        setSelectedVente(vente);
        setIsModalOpen(true);
    };

    const printTicket = (venteId) => {
        window.open(`http://127.0.0.1:8000/ventes/${venteId}/ticket`, '_blank');
    };

    return (
        <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Statistiques des Vendeurs</h2>}
    >
        <Head title="Statistiques des Vendeurs" />
    
        <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Vendeurs List */}
                    <div className="card bg-base-100 shadow-xl lg:col-span-1">
                        <div className="card-body">
                            <h3 className="mb-4 text-lg font-medium card-title">Liste des Vendeurs</h3>
                            <div className="space-y-2">
                                {vendeurs.map((vendeur) => (
                                    <div
                                        key={vendeur.id}
                                        className={`cursor-pointer overflow-hidden rounded-lg p-1 transition-colors ${
                                            selectedVendeur?.id === vendeur.id 
                                                ? 'bg-primary text-primary-content' 
                                                : 'hover:bg-base-200'
                                        }`}
                                        onClick={() => handleVendeurSelect(vendeur)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="w-10 rounded-full">
                                                    <img src={vendeur.photo || '/images/default-avatar.png'} alt={vendeur.name} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{vendeur.name}</p>
                                                <p className="text-xs opacity-70">{vendeur.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Stats and Ventes */}
                    <div className="space-y-6 lg:col-span-3">
                        {selectedVendeur ? (
                            <>
                                {/* Filters */}
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h3 className="mb-4 text-lg font-medium card-title">Filtrer les ventes</h3>
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                className={`btn ${periode === 'today' ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => handlePeriodeChange('today')}
                                            >
                                                Aujourd'hui
                                            </button>
                                            <button
                                                className={`btn ${periode === 'yesterday' ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => handlePeriodeChange('yesterday')}
                                            >
                                                Hier
                                            </button>
                                            <button
                                                className={`btn ${periode === 'month' ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => handlePeriodeChange('month')}
                                            >
                                                Ce mois
                                            </button>
                                            <button
                                                className={`btn ${periode === 'custom' ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => handlePeriodeChange('custom')}
                                            >
                                                Personnalisé
                                            </button>
    
                                            {periode === 'custom' && (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="date"
                                                        className="input input-bordered"
                                                        value={dateDebut}
                                                        onChange={(e) => {
                                                            setDateDebut(e.target.value);
                                                            reloadData();
                                                        }}
                                                    />
                                                    <span>à</span>
                                                    <input
                                                        type="date"
                                                        className="input input-bordered"
                                                        value={dateFin}
                                                        onChange={(e) => {
                                                            setDateFin(e.target.value);
                                                            reloadData();
                                                        }}
                                                        min={dateDebut}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
    
                                {/* Stats Summary */}
                                {stats && (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                        <div className="stats bg-primary text-primary-content shadow">
                                            <div className="stat">
                                                <div className="stat-title">Total Ventes</div>
                                                <div className="stat-value">{stats.total_ventes}</div>
                                            </div>
                                        </div>
                                        <div className="stats bg-secondary text-secondary-content shadow">
                                            <div className="stat">
                                                <div className="stat-title">Total HT</div>
                                                <div className="stat-value text-xl">{stats.total_ht.toLocaleString('fr-FR')} FC</div>
                                            </div>
                                        </div>
                                        <div className="stats bg-accent text-accent-content shadow">
                                            <div className="stat">
                                                <div className="stat-title">Total TVA</div>
                                                <div className="stat-value text-xl">{stats.total_tva.toLocaleString('fr-FR')} FC</div>
                                            </div>
                                        </div>
                                        <div className="stats bg-neutral text-neutral-content shadow">
                                            <div className="stat">
                                                <div className="stat-title">Total TTC</div>
                                                <div className="stat-value text-xl">{stats.total_ttc.toLocaleString('fr-FR')} FC</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
    
                                {/* Ventes List */}
                                <div className="card bg-base-100 shadow-xl overflow-hidden">
                                    <div className="card-body p-0">
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra w-full">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Client</th>
                                                        <th>Total TTC</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ventes.length > 0 ? (
                                                        ventes.map((vente) => (
                                                            <tr key={vente.id}>
                                                                <td>
                                                                    {format(new Date(vente.created_at), 'PPpp', { locale: fr })}
                                                                </td>
                                                                <td>{vente.client.name}</td>
                                                                <td>{vente.total_ttc.toLocaleString('fr-FR')} FC</td>
                                                                <td className="flex space-x-2">
                                                                    <button
                                                                        className="btn btn-info btn-sm"
                                                                        onClick={() => openVenteDetails(vente)}
                                                                    >
                                                                        Détails
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-success btn-sm"
                                                                        onClick={() => printTicket(vente.id)}
                                                                    >
                                                                        Imprimer
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="py-4 text-center">
                                                                Aucune vente trouvée pour cette période
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body text-center">
                                    <div className="mb-2 text-2xl font-medium">Sélectionnez un vendeur</div>
                                    <p className="text-base-content/60">
                                        Veuillez sélectionner un vendeur dans la liste pour afficher ses statistiques
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    
        {/* Vente Details Modal */}
        {isModalOpen && selectedVente && (
            <div className="modal modal-open">
                <div className="modal-box max-w-4xl">
                    <h3 className="mb-4 text-lg font-bold">
                        Détails de la vente #{selectedVente.code}
                        <span className="ml-2 badge badge-primary">
                            {format(new Date(selectedVente.created_at), 'PPpp', { locale: fr })}
                        </span>
                    </h3>
                    
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <h4 className="mb-2 font-medium">Informations client</h4>
                            <div className="rounded-lg bg-base-200 p-4">
                                <p><span className="font-medium">Nom:</span> {selectedVente.client.name}</p>
                                {selectedVente.client.phone && (
                                    <p><span className="font-medium">Téléphone:</span> {selectedVente.client.phone}</p>
                                )}
                                {selectedVente.client.email && (
                                    <p><span className="font-medium">Email:</span> {selectedVente.client.email}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-2 font-medium">Totaux</h4>
                            <div className="rounded-lg bg-base-200 p-4">
                                <p><span className="font-medium">Total HT:</span> {selectedVente.total_ht.toLocaleString('fr-FR')} FC</p>
                                <p><span className="font-medium">Total TVA:</span> {selectedVente.total_tva.toLocaleString('fr-FR')} FC</p>
                                <p><span className="font-medium">Total TTC:</span> {selectedVente.total_ttc.toLocaleString('fr-FR')} FC</p>
                                <p><span className="font-medium">Remise:</span> {selectedVente.remise}%</p>
                                <p><span className="font-medium">Montant payé:</span> {selectedVente.montant_paye.toLocaleString('fr-FR')} FC</p>
                            </div>
                        </div>
                    </div>
    
                    <h4 className="mb-2 font-medium">Articles vendus</h4>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Quantité</th>
                                    <th>Prix unitaire</th>
                                    <th>TVA</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedVente.articles.map((article) => (
                                    <tr key={article.id}>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12">
                                                        <img src={article.produit.image || '/images/default-product.png'} alt={article.produit.nom} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{article.produit.nom}</div>
                                                    <div className="text-sm opacity-50">{article.produit.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{article.quantite}</td>
                                        <td>{article.prix_unitaire.toLocaleString('fr-FR')} FC</td>
                                        <td>{article.taux_tva}%</td>
                                        <td>{article.montant_ttc.toLocaleString('fr-FR')} FC</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
    
                    <div className="modal-action">
                        <button 
                            className="btn btn-success"
                            onClick={() => printTicket(selectedVente.id)}
                        >
                            Imprimer le ticket
                        </button>
                        <button 
                            className="btn btn-error"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        )}
    </AuthenticatedLayout>
    );
}