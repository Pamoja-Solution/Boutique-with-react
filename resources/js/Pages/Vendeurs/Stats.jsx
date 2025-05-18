import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StatistiquesVendeurs = ({ quotidiennes, mensuelles, annuelles }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'CDF' 
        }).format(amount);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Statistiques des Vendeurs" />
            
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Statistiques des Vendeurs</h1>
                </div>

                <div className="grid gap-6">
                    {/* Statistiques quotidiennes */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Meilleurs vendeurs du jour</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Vendeur</th>
                                            <th>Total Ventes</th>
                                            <th>Nombre de ventes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotidiennes.map((vente, index) => (
                                            <tr key={vente.user_id}>
                                                <td>{index + 1}</td>
                                                <td>{vente.user?.name}</td>
                                                <td>{formatCurrency(vente.total_ventes)}</td>
                                                <td>{vente.nombre_ventes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques mensuelles */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Meilleurs vendeurs du mois</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Vendeur</th>
                                            <th>Total Ventes</th>
                                            <th>Nombre de ventes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mensuelles.map((vente, index) => (
                                            <tr key={vente.user_id}>
                                                <td>{index + 1}</td>
                                                <td>{vente.user?.name}</td>
                                                <td>{formatCurrency(vente.total_ventes)}</td>
                                                <td>{vente.nombre_ventes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques annuelles */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Meilleurs vendeurs de l'année</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Vendeur</th>
                                            <th>Total Ventes</th>
                                            <th>Nombre de ventes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {annuelles.map((vente, index) => (
                                            <tr key={vente.user_id}>
                                                <td>{index + 1}</td>
                                                <td>{vente.user?.name}</td>
                                                <td>{formatCurrency(vente.total_ventes)}</td>
                                                <td>{vente.nombre_ventes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default StatistiquesVendeurs;