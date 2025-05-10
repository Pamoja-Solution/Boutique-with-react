import React from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { router } from '@inertiajs/react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ClientStats({ stats, chartData, period, clientType }) {
    const handlePeriodChange = (newPeriod) => {
        router.get(route('clients.stats'), { period: newPeriod, type: clientType }, {
            preserveState: true,
            replace: true
        });
    };

    const handleTypeChange = (newType) => {
        router.get(route('clients.stats'), { period, type: newType }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Statistiques Clients" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold">Statistiques Clients</h1>
                    
                    <div className="flex flex-col md:flex-row gap-2">
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
                        
                        <div className="join">
                        <select 
                            className="select select-bordered"
                            value={clientType}
                            onChange={(e) => handleTypeChange(e.target.value)}
                        >
                            <option value="all">Tous les types</option>
                            <option value="occasionnel">Occasionnels</option>
                            <option value="regulier">Réguliers</option>
                            <option value="entreprise">Entreprises</option>
                        </select>
                        </div>
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-primary">Total Clients</h2>
                            <p className="text-3xl font-bold">{stats.total_clients}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-secondary">Ventes</h2>
                            <p className="text-3xl font-bold">{stats.total_ventes}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title text-accent">Chiffre d'Affaires</h2>
                            <p className="text-3xl font-bold">{stats.chiffre_affaires.toFixed(2)} FC</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Clients Actifs</h2>
                            <p className="text-3xl font-bold">{stats.clients_actifs}</p>
                        </div>
                    </div>
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Évolution des ventes</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} FC`, 'Montant']} />
                                        <Legend />
                                        <Bar dataKey="total" name="Chiffre d'affaires" fill="#8884d8" />
                                        <Bar dataKey="count" name="Nombre de ventes" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Répartition par type</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.ventes_par_type}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="total_ttc"
                                            nameKey="type"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {stats.ventes_par_type.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} FC`, 'Montant']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top clients */}
                <div className="card bg-base-100 shadow mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Top 5 des clients</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Type</th>
                                        <th className="text-right">Nombre de ventes</th>
                                        <th className="text-right">Chiffre d'affaires</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.top_clients.map((item) => (
                                        <tr key={item.client_id}>
                                            <td>{item.client.name}</td>
                                            <td>
                                                <span className={`badge ${
                                                    item.client.type === 'entreprise' ? 'badge-primary' :
                                                    item.client.type === 'regulier' ? 'badge-secondary' : 'badge-accent'
                                                }`}>
                                                    {item.client.type}
                                                </span>
                                            </td>
                                            <td className="text-right">{item.total_ventes}</td>
                                            <td className="text-right">{item.total_ttc.toFixed(2)} FC</td>
                                            <td className="text-right">
                                                <Link 
                                                    href={route('clients.stats.show', item.client_id)}
                                                    className="btn btn-sm btn-info"
                                                >
                                                    Détails
                                                </Link>
                                            </td>
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