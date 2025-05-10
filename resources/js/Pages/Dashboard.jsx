import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            

            {/* NOUVEAU: Zone principale de contenu avec scroll */}
            <div className="flex-1 overflow-y-auto p-4 bg-base-200">
                {/* AMÉLIORÉ: Tableau de bord avec tuiles */}
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
                            <div className="stat-value text-primary">145,290 FC</div>
                            <div className="stat-desc">↗︎ 12% par rapport à hier</div>
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
                            <div className="stat-value text-secondary">23</div>
                            <div className="stat-desc">↗︎ 5 de plus qu'hier</div>
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
                            <div className="stat-value text-warning">7</div>
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
                            <div className="stat-value text-success">43,580 FC</div>
                            <div className="stat-desc">↗︎ 8% par rapport à hier</div>
                        </div>
                    </div>
                </div>

                {/* NOUVEAU: Graphiques et données */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Graphique ventes */}
                    <div className="card bg-base-100 shadow-xl lg:col-span-2">
                        <div className="card-body">
                            <h2 className="card-title flex justify-between">
                                <span>Tendance des ventes</span>
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                                        <span>7 derniers jours</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                                        <li><a>7 derniers jours</a></li>
                                        <li><a>30 derniers jours</a></li>
                                        <li><a>Cette année</a></li>
                                    </ul>
                                </div>
                            </h2>
                            <div className="h-64 w-full">
                                {/* Emplacement pour le graphique */}
                                <div className="w-full h-full bg-base-200 rounded-lg flex items-center justify-center">
                                    <span className="text-sm opacity-70">Graphique des ventes ici</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* NOUVEAU: Activité récente */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Activité récente</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                <div className="flex gap-3 items-start">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content w-8 h-8 rounded-full">
                                            <span className="text-xs">VS</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Vente #1254 complétée</p>
                                        <p className="text-xs opacity-70">Il y a 10 min • 15,200 FC</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 items-start">
                                    <div className="avatar placeholder">
                                        <div className="bg-warning text-warning-content w-8 h-8 rounded-full">
                                            <span className="text-xs">ST</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Stock faible: Huile végétale</p>
                                        <p className="text-xs opacity-70">Il y a 25 min • 3 unités restantes</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 items-start">
                                    <div className="avatar placeholder">
                                        <div className="bg-success text-success-content w-8 h-8 rounded-full">
                                            <span className="text-xs">CL</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Nouveau client: Marie Dupont</p>
                                        <p className="text-xs opacity-70">Il y a 1h • Ajouté au programme fidélité</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 items-start">
                                    <div className="avatar placeholder">
                                        <div className="bg-error text-error-content w-8 h-8 rounded-full">
                                            <span className="text-xs">DP</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Dépense enregistrée</p>
                                        <p className="text-xs opacity-70">Il y a 2h • Loyer • 75,000 FC</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-actions justify-end">
                                <button className="btn btn-sm btn-ghost">Voir tout</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NOUVEAU: Section produits et tableaux */}
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
                                        <tr>
                                            <td>Riz blanc 5kg</td>
                                            <td>42 unités</td>
                                            <td>84,000 FC</td>
                                        </tr>
                                        <tr>
                                            <td>Huile végétale 1L</td>
                                            <td>38 unités</td>
                                            <td>57,000 FC</td>
                                        </tr>
                                        <tr>
                                            <td>Lait en poudre 400g</td>
                                            <td>25 unités</td>
                                            <td>45,000 FC</td>
                                        </tr>
                                        <tr>
                                            <td>Savon de ménage</td>
                                            <td>22 unités</td>
                                            <td>11,000 FC</td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                            <th>Points fidélité</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                                                        <span className="text-xs">JD</span>
                                                    </div>
                                                </div>
                                                <span>Jean Dupont</span>
                                            </td>
                                            <td>15</td>
                                            <td>450 pts</td>
                                        </tr>
                                        <tr>
                                            <td className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                                                        <span className="text-xs">SK</span>
                                                    </div>
                                                </div>
                                                <span>Sarah Kouassi</span>
                                            </td>
                                            <td>12</td>
                                            <td>320 pts</td>
                                        </tr>
                                        <tr>
                                            <td className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                                                        <span className="text-xs">PM</span>
                                                    </div>
                                                </div>
                                                <span>Paul Mbarga</span>
                                            </td>
                                            <td>8</td>
                                            <td>240 pts</td>
                                        </tr>
                                        <tr>
                                            <td className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                                                        <span className="text-xs">LT</span>
                                                    </div>
                                                </div>
                                                <span>Lucie Togo</span>
                                            </td>
                                            <td>7</td>
                                            <td>180 pts</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NOUVEAU: Alertes et informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Alertes de stock */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-warning flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Alertes de stock
                            </h2>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                <div className="flex justify-between items-center p-2 bg-warning bg-opacity-10 rounded-lg">
                                    <span>Huile végétale 1L</span>
                                    <span className="badge badge-warning">3 restants</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-warning bg-opacity-10 rounded-lg">
                                    <span>Farine de blé 5kg</span>
                                    <span className="badge badge-warning">5 restants</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-warning bg-opacity-10 rounded-lg">
                                    <span>Lait en poudre 400g</span>
                                    <span className="badge badge-warning">2 restants</span>
                                </div>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('stocks.low')} className="btn btn-sm btn-warning btn-outline">Gérer les stocks</Link>
                            </div>
                        </div>
                    </div>

                    {/* Promotions actives */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-success flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                                </svg>
                                Promotions actives
                            </h2>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                <div className="flex justify-between items-center p-2 bg-success bg-opacity-10 rounded-lg">
                                    <span>Savon -15%</span>
                                    <span className="badge badge-success">3 jours restants</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-success bg-opacity-10 rounded-lg">
                                    <span>2+1 sur produits laitiers</span>
                                    <span className="badge badge-success">1 jour restant</span>
                                </div>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('promotions.index')} className="btn btn-sm btn-success btn-outline">Gérer les promos</Link>
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
                                <div className="flex justify-between items-center p-2 bg-info bg-opacity-10 rounded-lg">
                                    <div>
                                        <span className="font-medium">Caisse principale</span>
                                        <div className="text-xs opacity-70">Ouverte à 08:15</div>
                                    </div>
                                    <span className="font-medium">245,300 FC</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-info bg-opacity-10 rounded-lg">
                                    <div>
                                        <span className="font-medium">Caisse secondaire</span>
                                        <div className="text-xs opacity-70">Fermée</div>
                                    </div>
                                    <span className="font-medium">0 FC</span>
                                </div>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <Link href={route('cashregister.index')} className="btn btn-sm btn-info btn-outline">Gérer les caisses</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
