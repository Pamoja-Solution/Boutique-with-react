import React, { useEffect, useState } from 'react';
import { usePage, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { router } from '@inertiajs/react';

export default function VenteStats({ stats, chartData, period }) {
    const { user } = usePage().props.auth;
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    }, []);

    const handlePeriodChange = (newPeriod) => {
        router.get(route('ventes.stats'), { period: newPeriod }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mes Statistiques de Ventes" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Mes Statistiques de Ventes</h1>
                    <div className="join">
                        {['day', 'week', 'month', 'year'].map((p) => (
                            <button
                                key={p}
                                className={`join-item btn ${period === p ? 'btn-active' : ''}`}
                                onClick={() => handlePeriodChange(p)}
                            >
                                {p === 'day' && 'Aujourd\'hui'}
                                {p === 'week' && 'Cette semaine'}
                                {p === 'month' && 'Ce mois'}
                                {p === 'year' && 'Cette année'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-primary">Total Ventes</h2>
                            <p className="text-4xl font-bold">{stats.total_ventes}</p>
                            <p className="text-sm text-gray-500">Nombre de ventes effectuées</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-secondary">Chiffre d'Affaires</h2>
                            <p className="text-4xl font-bold">{stats.total_ttc.toFixed(2)} FC</p>
                            <p className="text-sm text-gray-500">Montant total TTC</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-accent">Moyenne par Vente</h2>
                            <p className="text-4xl font-bold">{stats.moyenne_vente ? stats.moyenne_vente.toFixed(2) : '0.00'} FC</p>
                            <p className="text-sm text-gray-500">Panier moyen</p>
                        </div>
                    </div>
                </div>

                {/* Graphique */}
                <div className="card bg-base-100 shadow mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Évolution des ventes</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip 
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1f2937' : '#011f2f',
                                        color: isDark ? '#d1d5db' : '#fff',
                                        borderColor: isDark ? '#4b5563' : '#d1d5db',
                                        
                                      }}
                                            formatter={(value, name) => {
                                                if (name === 'Chiffre d\'affaires') {
                                                return [`${value} FC`, name];
                                                }
                                                return [value, name];
                                            }}
                                            />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#8884d8" 
                                        name="Chiffre d'affaires"
                                        activeDot={{ r: 8 }} 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#82ca9d" 
                                        name="Nombre de ventes"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top produits */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Top 5 des produits vendus</h2>
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
                                    {stats.top_produits.map((item) => (
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