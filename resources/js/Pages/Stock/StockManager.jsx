import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function StockManager({ produit, stocks, produits, rayons }) {
    const { flash } = usePage().props;
    const [selectedProduit, setSelectedProduit] = useState(produit || null);
    const [sourceStocks, setSourceStocks] = useState([]);
    const [destinationStocks, setDestinationStocks] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        produit_id: selectedProduit?.id || '',
        rayon_source_id: '',
        rayon_destination_id: '',
        quantite: 1,
        motif: ''
    });

    // Gérer les messages flash avec des toasts
    useEffect(() => {
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // Mettre à jour les stocks disponibles quand le produit ou le rayon source change
    useEffect(() => {
        if (data.produit_id && data.rayon_source_id) {
            const stock = stocks.find(s => 
                s.produit_id == data.produit_id && 
                s.rayon_id == data.rayon_source_id
            );
            
            if (!stock) {
                toast.error('Aucun stock disponible pour ce produit dans le rayon source sélectionné');
                setData('quantite', 1);
            }
        }
    }, [data.produit_id, data.rayon_source_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation supplémentaire côté client
        if (data.rayon_source_id === data.rayon_destination_id) {
            toast.error('Les rayons source et destination doivent être différents');
            return;
        }

        post(route('stock.transfert'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                Object.values(errors).forEach(error => {
                    toast.error(error);
                });
            }
        });
    };

    const handleProduitChange = (produitId) => {
        const produit = produits.find(p => p.id === parseInt(produitId));
        setSelectedProduit(produit || null);
        setData({
            produit_id: produitId,
            rayon_source_id: '',
            rayon_destination_id: '',
            quantite: 1,
            motif: ''
        });
    };

    // Générer des clés uniques pour les lignes du tableau
    const generateStockKey = (stock) => {
        return `${stock.produit_id}-${stock.rayon_id}-${stock.quantite}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestion des stocks" />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulaire de transfert */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Transfert de stock</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Produit</span>
                                    </label>
                                    <select
                                        className="select  select-primary"
                                        value={data.produit_id}
                                        onChange={(e) => handleProduitChange(e.target.value)}
                                        disabled={!!produit}
                                        required
                                    >
                                        <option value="">Sélectionnez un produit</option>
                                        {(produit ? [produit] : produits).map(p => (
                                            <option key={p.id} value={p.id}>{p.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Rayon source</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={data.rayon_source_id}
                                            onChange={(e) => setData('rayon_source_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Sélectionnez un rayon</option>
                                            {rayons.map(r => {
                                                const stock = stocks.find(s => 
                                                    s.produit_id == data.produit_id && 
                                                    s.rayon_id == r.id
                                                );
                                                return stock ? (
                                                    <option key={r.id} value={r.id}>
                                                        {r.nom} (Stock: {stock.quantite})
                                                    </option>
                                                ) : null;
                                            }).filter(Boolean)}
                                        </select>
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Rayon destination</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={data.rayon_destination_id}
                                            onChange={(e) => setData('rayon_destination_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Sélectionnez un rayon</option>
                                            {rayons.filter(r => r.id != data.rayon_source_id).map(r => (
                                                <option key={r.id} value={r.id}>{r.nom}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text">Quantité</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input input-bordered w-full"
                                        value={data.quantite}
                                        onChange={(e) => {
                                            const selectedStock = stocks.find(s => 
                                                s.produit_id == data.produit_id && 
                                                s.rayon_id == data.rayon_source_id
                                            );
                                            const maxQty = selectedStock ? selectedStock.quantite : 1;
                                            const value = Math.min(parseInt(e.target.value) || 0, maxQty);
                                            setData('quantite', value > 0 ? value : 1);
                                        }}
                                        required
                                    />
                                </div>

                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text">Motif (optionnel)</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-24"
                                        placeholder="Motif du transfert"
                                        value={data.motif}
                                        onChange={(e) => setData('motif', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="card-actions justify-end mt-6">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={processing || !data.produit_id || !data.rayon_source_id || !data.rayon_destination_id}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Transfert en cours...
                                            </>
                                        ) : 'Effectuer le transfert'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Liste des stocks */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Stocks disponibles</h2>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Rayon</th>
                                            <th className="text-right">Quantité</th>
                                            <th className="text-right">Alerte</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stocks.map(stock => (
                                            <tr key={generateStockKey(stock)}>
                                                <td>{stock.produit.nom}</td>
                                                <td>{stock.rayon.nom}</td>
                                                <td className="text-right">
                                                    <span className={stock.quantite <= stock.quantite_alerte ? 'text-error font-bold' : ''}>
                                                        {stock.quantite}
                                                    </span>
                                                </td>
                                                <td className="text-right">{stock.quantite_alerte}</td>
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
}