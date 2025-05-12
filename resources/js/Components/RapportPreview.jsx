// resources/js/Components/RapportPreview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Enregistrement des composants ChartJS nécessaires
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const RapportPreview = ({ typeRapport, dateDebut, dateFin, filtres }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('bar');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/rapports/preview', {
                    params: {
                        type_rapport: typeRapport,
                        date_debut: dateDebut,
                        date_fin: dateFin,
                        filtres: JSON.stringify(filtres)
                    }
                });
                
                setData(response.data);
                setError(null);
            } catch (err) {
                setError("Erreur lors du chargement des données");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [typeRapport, dateDebut, dateFin, filtres]);
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="alert alert-error">
                <div className="flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                    <label>{error}</label>
                </div>
            </div>
        );
    }
    
    if (!data) {
        return (
            <div className="alert alert-info">
                <div className="flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <label>Aucune donnée disponible pour les critères sélectionnés.</label>
                </div>
            </div>
        );
    }
    
    // Fonction pour générer les données du graphique selon le type de rapport
    const getChartData = () => {
        switch (typeRapport) {
            case 'ventes':
                return {
                    labels: data.labels || [],
                    datasets: [
                        {
                            label: 'Total des ventes (TTC)',
                            data: data.totalParJour || [],
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            borderColor: 'rgb(53, 162, 235)',
                            borderWidth: 1,
                        },
                    ],
                };
                
            case 'stock':
                return {
                    labels: data.produits || [],
                    datasets: [
                        {
                            label: 'Quantité en stock',
                            data: data.quantites || [],
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 1,
                        },
                    ],
                };
                
            case 'caisse':
                return {
                    labels: data.labels || [],
                    datasets: [
                        {
                            label: 'Entrées',
                            data: data.entrees || [],
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Sorties',
                            data: data.sorties || [],
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 1,
                        },
                    ],
                };
                
            case 'depenses':
                return {
                    labels: data.categories || [],
                    datasets: [
                        {
                            label: 'Montant des dépenses',
                            data: data.montants || [],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 206, 86, 0.5)',
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                };
                
            default:
                return {
                    labels: [],
                    datasets: [],
                };
        }
    };
    
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Aperçu du rapport: ${data.titre || ''}`,
            },
        },
    };
    
    const renderTablePreview = () => {
        switch (typeRapport) {
            case 'ventes':
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Total HT</th>
                                    <th>TVA</th>
                                    <th>Total TTC</th>
                                    <th>Remise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.ventes && data.ventes.slice(0, 5).map((vente, index) => (
                                    <tr key={index}>
                                        <td>{vente.code}</td>
                                        <td>{vente.date}</td>
                                        <td>{vente.client}</td>
                                        <td>{vente.total_ht}</td>
                                        <td>{vente.total_tva}</td>
                                        <td>{vente.total_ttc}</td>
                                        <td>{vente.remise}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3">TOTAL</td>
                                    <td>{data.totalHT}</td>
                                    <td>{data.totalTVA}</td>
                                    <td>{data.totalTTC}</td>
                                    <td>{data.totalRemise}</td>
                                </tr>
                            </tfoot>
                        </table>
                        {data.ventes && data.ventes.length > 5 && (
                            <div className="text-center text-sm text-gray-500 mt-2">
                                Affichage des 5 premiers résultats sur {data.ventes.length}
                            </div>
                        )}
                    </div>
                );
                
            case 'stock':
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Produit</th>
                                    <th>Rayon</th>
                                    <th>Quantité</th>
                                    <th>Alerte</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.stocks && data.stocks.slice(0, 5).map((stock, index) => (
                                    <tr key={index}>
                                        <td>{stock.code}</td>
                                        <td>{stock.produit}</td>
                                        <td>{stock.rayon}</td>
                                        <td>{stock.quantite}</td>
                                        <td>{stock.alerte}</td>
                                        <td>
                                            {stock.status === 'rupture' ? (
                                                <span className="badge badge-error">Rupture</span>
                                            ) : stock.status === 'alerte' ? (
                                                <span className="badge badge-warning">Alerte</span>
                                            ) : (
                                                <span className="badge badge-success">Normal</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.stocks && data.stocks.length > 5 && (
                            <div className="text-center text-sm text-gray-500 mt-2">
                                Affichage des 5 premiers résultats sur {data.stocks.length}
                            </div>
                        )}
                    </div>
                );
                
            // Ajouter d'autres cas pour les différents types de rapports
                
            default:
                return (
                    <div className="alert alert-info">
                        <div className="flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <label>Aperçu non disponible pour ce type de rapport.</label>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Aperçu du rapport</h2>
            
            <div className="flex justify-end mb-4">
                <div className="btn-group">
                    <button 
                        className={`btn btn-sm ${chartType === 'bar' ? 'btn-active' : ''}`}
                        onClick={() => setChartType('bar')}
                    >
                        Barre
                    </button>
                    <button 
                        className={`btn btn-sm ${chartType === 'line' ? 'btn-active' : ''}`}
                        onClick={() => setChartType('line')}
                    >
                        Ligne
                    </button>
                    <button 
                        className={`btn btn-sm ${chartType === 'pie' ? 'btn-active' : ''}`}
                        onClick={() => setChartType('pie')}
                    >
                        Camembert
                    </button>
                </div>
            </div>
            
            <div className="mb-8 h-64">
                {chartType === 'bar' && <Chart type="bar" data={getChartData()} options={chartOptions} />}
                {chartType === 'line' && <Chart type="line" data={getChartData()} options={chartOptions} />}
                {chartType === 'pie' && <Chart type="pie" data={getChartData()} options={chartOptions} />}
            </div>
            
            <div className="divider">Aperçu des données</div>
            
            {renderTablePreview()}
        </div>
    );
};

export default RapportPreview;