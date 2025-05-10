import React from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ClientShowStats({ client, stats }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Statistiques - ${client.name}`} />

            <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                    <Link href={route('clients.stats')} className="btn btn-ghost mr-4">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">
                        {client ? "Voir les détails" : "Créer une nouvelle catégorie"}
                    </h1>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">{client.name}</h1>
                        <div className="flex gap-4 mt-2">
                            <span className={`badge ${
                                client.type === 'entreprise' ? 'badge-primary' :
                                client.type === 'regulier' ? 'badge-secondary' : 'badge-accent'
                            }`}>
                                {client.type}
                            </span>
                            {client.email && <span className="badge badge-outline">{client.email}</span>}
                            {client.phone && <span className="badge badge-outline">{client.phone}</span>}
                        </div>
                    </div>
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Points fidélité</div>
                            <div className="stat-value">{client.solde_points}</div>
                        </div>
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Total Ventes</h2>
                            <p className="text-4xl font-bold">{stats.total_ventes}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Chiffre d'Affaires</h2>
                            <p className="text-4xl font-bold">{stats.total_ttc.toFixed(2)} FC</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Panier Moyen</h2>
                            <p className="text-4xl font-bold">{stats.moyenne_vente.toFixed(2)} FC</p>
                        </div>
                    </div>
                </div>

                {/* Dernières ventes */}
                <div className="card bg-base-100 shadow mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Dernières ventes</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>N° Vente</th>
                                        <th>Caissier</th>
                                        <th className="text-right">Montant TTC</th>
                                        <th className="text-right">Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.dernieres_ventes.map((vente) => (
                                        <tr key={vente.id}>
                                            <td>{new Date(vente.created_at).toLocaleDateString()}</td>
                                            <td>{vente.code}</td>
                                            <td>{vente.user.name}</td>
                                            <td className="text-right">{vente.total_ttc.toFixed(2)} FC</td>
                                            <td className="text-right">
                                                <span className={`badge ${
                                                    vente.statut === 'terminee' ? 'badge-success' :
                                                    vente.statut === 'annulee' ? 'badge-error' : 'badge-warning'
                                                }`}>
                                                    {vente.statut}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Produits fréquents */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Produits fréquemment achetés</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th className="text-right">Quantité</th>
                                        <th className="text-right">Montant TTC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.produits_frequents.map((item) => (
                                        <tr key={item.produit_id}>
                                            <td>{item.produit.nom}</td>
                                            <td className="text-right">{item.total_quantite}</td>
                                            <td className="text-right">{item.total_ttc.toFixed(2)} FC</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}