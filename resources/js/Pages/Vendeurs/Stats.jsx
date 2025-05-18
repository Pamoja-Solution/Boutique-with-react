import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function VendeursStats({ period, mensuelles, annuelles, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get(route('vendeurs-stats'), { 
            start_date: startDate,
            end_date: endDate 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilter = () => {
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        router.get(route('stats.vendeurs'), {}, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout 
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Statistiques des vendeurs</h2>}
        >
            <Head title="Statistiques des vendeurs" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtre par date */}
                    <div class="card bg-base-300 shadow-sm sm:rounded-box mb-6 p-4">
    <h3 class="text-lg font-medium mb-4">Filtrer par période</h3>
    <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
            <label class="label">
                <span class="label-text">Date de début</span>
            </label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                class="input input-bordered w-full"
            />
        </div>
        <div class="flex-1">
            <label class="label">
                <span class="label-text">Date de fin</span>
            </label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                class="input input-bordered w-full"
            />
        </div>
        <div class="flex items-end gap-2">
            <button 
                onClick={handleFilter}
                class="btn btn-primary"
            >
                Appliquer
            </button>
            <button 
                onClick={resetFilter}
                class="btn btn-ghost"
            >
                Réinitialiser
            </button>
        </div>
    </div>
</div>

                    {/* Statistiques pour la période sélectionnée */}
                    <div className="bg-base-300 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium mb-4">
                                Statistiques du {new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()}
                            </h3>
                            {period.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th>Vendeur</th>
                                                <th>Date</th>
                                                <th>Nombre de ventes</th>
                                                <th>Total des ventes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {period.map((vente) => (
                                                <tr key={`${vente.user_id}-${vente.date}`}>
                                                    <td>{vente.user?.name || 'Anonyme'}</td>
                                                    <td>{new Date(vente.date).toLocaleDateString()}</td>
                                                    <td>{vente.nombre_ventes}</td>
                                                    <td>{vente.total_ventes.toFixed(2)} FC</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>Aucune vente trouvée pour cette période.</p>
                            )}
                        </div>
                    </div>

                    {/* Statistiques mensuelles */}
                    <div className="bg-base-300 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium mb-4">Statistiques mensuelles</h3>
                            {mensuelles.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th>Vendeur</th>
                                                <th>Mois/Année</th>
                                                <th>Nombre de ventes</th>
                                                <th>Total des ventes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mensuelles.map((vente) => (
                                                <tr key={`${vente.user_id}-${vente.mois}-${vente.annee}`}>
                                                    <td>{vente.user?.name || 'Anonyme'}</td>
                                                    <td>{vente.mois}/{vente.annee}</td>
                                                    <td>{vente.nombre_ventes}</td>
                                                    <td>{vente.total_ventes.toFixed(2)} FC</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>Aucune vente mensuelle trouvée.</p>
                            )}
                        </div>
                    </div>

                    {/* Statistiques annuelles */}
                    <div className="bg-base-300 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium mb-4">Statistiques annuelles</h3>
                            {annuelles.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th>Vendeur</th>
                                                <th>Année</th>
                                                <th>Nombre de ventes</th>
                                                <th>Total des ventes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {annuelles.map((vente) => (
                                                <tr key={`${vente.user_id}-${vente.annee}`}>
                                                    <td>{vente.user?.name || 'Anonyme'}</td>
                                                    <td>{vente.annee}</td>
                                                    <td>{vente.nombre_ventes}</td>
                                                    <td>{vente.total_ventes.toFixed(2)} FC</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>Aucune vente annuelle trouvée.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}