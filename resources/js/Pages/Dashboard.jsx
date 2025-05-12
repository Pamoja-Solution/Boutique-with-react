import SalesChart from '@/Components/SalesChart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ 
    stats, 
    recentSales, 
    topProducts, 
    bestCustomers, 
    stockAlerts, 
    cashierStatus,
    salesTrend,
    recentActivities 
}) {
    const [timeRange, setTimeRange] = useState('7days');
    //console.log(salesTrend)
    // Fonction pour formater les montants
    const formatCurrency = (total) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'CDF',
            minimumFractionDigits: 0
        }).format(total).replace('CDF', 'FC');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tableau de Bord
                </h2>
            }
        >
            <Head title="Tableau de Bord" />

            <div className="flex-1 overflow-y-auto p-4 bg-base-200">
                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Ventes du jour */}
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="stat-title">Ventes (Aujourd'hui)</div>
                            <div className="stat-value text-primary">{formatCurrency(stats.today_sales)}</div>
                            <div className={`stat-desc ${stats.sales_change >= 0 ? 'text-success' : 'text-error'}`}>
                                {stats.sales_change >= 0 ? '↗︎' : '↘︎'} {Math.abs(stats.sales_change)}% par rapport à hier
                            </div>
                        </div>
                    </div>
                    
                    {/* Nombre de ventes */}
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="stat-title">Transactions</div>
                            <div className="stat-value text-secondary">{stats.today_transactions}</div>
                            <div className={`stat-desc ${stats.transactions_change >= 0 ? 'text-success' : 'text-error'}`}>
                                {stats.transactions_change >= 0 ? '↗︎' : '↘︎'} {Math.abs(stats.transactions_change)} de plus qu'hier
                            </div>
                        </div>
                    </div>
                    
                    {/* Stock critique */}
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="stat-title">Stock critique</div>
                            <div className="stat-value text-warning">{stats.low_stock_items}</div>
                            <div className="stat-desc">Produits à réapprovisionner</div>
                        </div>
                    </div>
                    
                    {/* Bénéfice estimé */}
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-success">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="stat-title">Bénéfice (Aujourd'hui)</div>
                            <div className="stat-value text-success">{formatCurrency(stats.today_profit)}</div>
                            <div className={`stat-desc ${stats.profit_change >= 0 ? 'text-success' : 'text-error'}`}>
                                {stats.profit_change >= 0 ? '↗︎' : '↘︎'} {Math.abs(stats.profit_change)}% par rapport à hier
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graphiques et données */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Graphique ventes */}
                    <div className="card bg-base-100 shadow-xl lg:col-span-2">
                        <div className="card-body">
                            <h2 className="card-title flex justify-between">
                                <span>Tendance des ventes</span>
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                                        <span>
                                            {timeRange === '7days' && '7 derniers jours'}
                                            {timeRange === '30days' && '30 derniers jours'}
                                            {timeRange === 'year' && 'Cette année'}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                                        <li><button onClick={() => setTimeRange('7days')}>7 derniers jours</button></li>
                                        <li><button onClick={() => setTimeRange('30days')}>30 derniers jours</button></li>
                                        <li><button onClick={() => setTimeRange('year')}>Cette année</button></li>
                                    </ul>
                                </div>
                            </h2>
                            <div className="h-64 w-full">
                                {/* Graphique réel pourrait être implémenté avec Chart.js */}
                                <div className="w-full h-full bg-base-200 rounded-lg flex items-center justify-center">
                                <div className="flex justify-center mb-4">
                                    <div className="btn-group">
                                    <button
                                        className={`btn ${timeRange === "7days" ? "btn-primary" : ""}`}
                                        onClick={() => setTimeRange("7days")}
                                    >
                                        7 jours
                                    </button>
                                    <button
                                        className={`btn ${timeRange === "30days" ? "btn-primary" : ""}`}
                                        onClick={() => setTimeRange("30days")}
                                    >
                                        30 jours
                                    </button>
                                    <button
                                        className={`btn ${timeRange === "year" ? "btn-primary" : ""}`}
                                        onClick={() => setTimeRange("year")}
                                    >
                                        Année
                                    </button>
                                    </div>
                                </div>

                                <SalesChart salesTrend={salesTrend} timeRange={timeRange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Activité récente */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Activité récente</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="avatar placeholder">
                                            <div className={`bg-${activity.color} text-${activity.color}-content w-8 h-8 rounded-full`}>
                                                <span className="text-xs">{activity.type}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.description}</p>
                                            <p className="text-xs opacity-70">
                                                {activity.date} • {activity.user}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card-actions justify-end">
                                <Link href={route('activities.index')} className="btn btn-sm btn-ghost">Voir tout</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section produits et tableaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Produits les plus vendus */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Produits les plus vendus</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra table-sm">
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Vendu</th>
                                            <th>Revenu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topProducts.map((product, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        {product.image && (
                                                            <div className="avatar">
                                                                <div className="w-8 h-8 rounded">
                                                                    <img src={product.image} alt={product.name} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td>{product.quantity} unités</td>
                                                <td>{formatCurrency(product.revenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('produits.index')} className="btn btn-sm btn-ghost">Voir tous les produits</Link>
                            </div>
                        </div>
                    </div>

                    {/* Clients fidèles */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Meilleurs clients</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra table-sm">
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Achats</th>
                                            <th>Dépenses</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bestCustomers.map((customer, index) => (
                                            <tr key={index}>
                                                <td className="flex items-center gap-2">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                                                            <span className="text-xs">
                                                                {customer.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span>{customer.name}</span>
                                                </td>
                                                <td>{customer.purchases} trans.</td>
                                                <td>{formatCurrency(customer.total_spent)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('clients.index')} className="btn btn-sm btn-ghost">Voir tous les clients</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertes et informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Alertes de stock */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-accent flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Alertes de stock
                            </h2>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {stockAlerts.length > 0 ? (
                                    stockAlerts.map((alert, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-accent bg-opacity-10 rounded-lg">
                                            <div>
                                                <span>{alert.product_name}</span>
                                                <div className="text-xs opacity-70">Rayon: {alert.rayon_name}</div>
                                            </div>
                                            <span className="badge badge-accent">{alert.current_quantity} restants</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-sm opacity-70">
                                        Aucune alerte de stock pour le moment
                                    </div>
                                )}
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('stocks.index')} className="btn btn-sm btn-warning btn-outline">Gérer les stocks</Link>
                            </div>
                        </div>
                    </div>

                    {/* Dernières ventes */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-primary flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Dernières ventes
                            </h2>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {recentSales.length > 0 ? (
                                    recentSales.map((sale, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-primary bg-opacity-10 rounded-lg">
                                            <div>
                                                <span className="font-medium">Vente #{sale.code}</span>
                                                <div className="text-xs opacity-70">
                                                    {new Date(sale.created_at).toLocaleTimeString()} • {sale.client_name || 'Client occasionnel'}
                                                </div>
                                            </div>
                                            <span className="font-medium">{formatCurrency(sale.total_ttc)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-sm opacity-70">
                                        Aucune vente récente
                                    </div>
                                )}
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('point-de-vente')} className="btn btn-sm btn-primary">Nouvelle vente</Link>
                            </div>
                        </div>
                    </div>

                    {/* Statut caisse */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-info flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Statut des caisses
                            </h2>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {cashierStatus.map((caisse, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-info bg-opacity-10 rounded-lg">
                                        <div>
                                            <span className="font-medium">{caisse.name}</span>
                                            <div className="text-xs opacity-70">
                                                {caisse.is_active ? `Ouverte à ${caisse.opened_at}` : 'Fermée'} • {caisse.devise_code}
                                            </div>
                                        </div>
                                        <span className="font-medium">
                                            {formatCurrency(caisse.solde_actuel)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('caisses.index')} className="btn btn-sm btn-info btn-outline">Gérer les caisses</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section rapide pour administrateurs */}
                <div className="mt-6 card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Actions Rapides</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            <Link href={route('point-de-vente')} className="btn btn-sm btn-primary">
                                Nouvelle Vente
                            </Link>
                            <Link href={route('produits.index')} className="btn btn-sm btn-secondary">
                                Ajouter Produit
                            </Link>
                            <Link href={route('gererClients.index')} className="btn btn-sm btn-accent">
                                Ajouter Client
                            </Link>
                            <Link href={route('stocks.indexs')} className="btn btn-sm btn-info">
                                Ajuster Stock
                            </Link>
                            <Link href={route('depenses.index')} className="btn btn-sm btn-warning">
                                Enregistrer Dépense
                            </Link>
                            <Link href={route('inventaires.index')} className="btn btn-sm btn-success">
                                Nouvel Inventaire
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}