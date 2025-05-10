import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function StockManager({ produit, rayons, stocks, onClose }) {
    const [mouvement, setMouvement] = useState({
        type: 'entree',
        quantity: 1,
        rayon_id: rayons[0]?.id,
        motif: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/stock-mouvements', {
            produit_id: produit.id,
            ...mouvement
        }, {
            onSuccess: () => {
                router.reload({ only: ['stocks'] });
                setMouvement({
                    type: 'entree',
                    quantity: 1,
                    rayon_id: rayons[0]?.id,
                    motif: ''
                });
            }
        });
    };

    return (
        <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box max-w-4xl">
                <h3 className="font-bold text-lg mb-4">Gestion de stock: {produit.nom}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Formulaire de mouvement de stock */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Ajouter un mouvement</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Type de mouvement*</span>
                                    </label>
                                    <select 
                                        value={mouvement.type}
                                        onChange={(e) => setMouvement({...mouvement, type: e.target.value})}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="entree">Entrée</option>
                                        <option value="sortie">Sortie</option>
                                        <option value="ajustement">Ajustement</option>
                                        <option value="transfert">Transfert</option>
                                    </select>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Rayon*</span>
                                    </label>
                                    <select 
                                        value={mouvement.rayon_id}
                                        onChange={(e) => setMouvement({...mouvement, rayon_id: e.target.value})}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        {rayons.map(rayon => (
                                            <option key={rayon.id} value={rayon.id}>
                                                {rayon.nom} ({rayon.code_emplacement})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Quantité*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={mouvement.quantity}
                                        onChange={(e) => setMouvement({...mouvement, quantity: e.target.value})}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Motif</span>
                                    </label>
                                    <textarea 
                                        value={mouvement.motif}
                                        onChange={(e) => setMouvement({...mouvement, motif: e.target.value})}
                                        className="textarea textarea-bordered"
                                        rows="2"
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={onClose} className="btn">
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Liste des stocks par rayon */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Stock par rayon</h4>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Rayon</th>
                                        <th>Quantité</th>
                                        <th>Alerte</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map(stock => (
                                        <tr key={stock.id}>
                                            <td>
                                                {stock.rayon.nom} ({stock.rayon.code_emplacement})
                                            </td>
                                            <td>
                                                <span className={`font-bold ${
                                                    stock.quantite <= 0 ? 'text-error' : 
                                                    stock.quantite <= stock.quantite_alerte ? 'text-warning' : 'text-success'
                                                }`}>
                                                    {stock.quantite}
                                                </span>
                                            </td>
                                            <td>{stock.quantite_alerte}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}