import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

export default function StockManager({ produit, rayons, stocks, onClose }) {
    const [mouvementType, setMouvementType] = useState('entree');
    const [showTransfert, setShowTransfert] = useState(false);

    const handleStockSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        router.post('/stock-mouvements', Object.fromEntries(formData), {
            onSuccess: () => {
                toast.success('Mouvement de stock enregistré avec succès !');
                e.target.reset();
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    const handleTransfertSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        router.post('/stocks/transfert', Object.fromEntries(formData), {
            onSuccess: () => {
                toast.success('Transfert de stock effectué avec succès !');
                e.target.reset();
                setShowTransfert(false);
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    // Calculer le stock total
    const totalStock = stocks.reduce((sum, stock) => sum + stock.quantite, 0);

    // Filtrer les rayons qui ont du stock disponible (pour le transfert)
    const rayonsAvecStock = stocks.filter(stock => stock.quantite > 0)
        .map(stock => rayons.find(r => r.id === stock.rayon_id));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-box shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Gestion du stock - {produit.nom}</h2>
                        <button onClick={onClose} className="btn btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    <div className="stats shadow mb-6 w-full">
                        <div className="stat">
                            <div className="stat-title">Stock Total</div>
                            <div className={`stat-value ${totalStock <= 0 ? 'text-error' : totalStock <= 10 ? 'text-warning' : 'text-success'}`}>
                                {totalStock}
                            </div>
                            <div className="stat-desc">Unités disponibles</div>
                        </div>
                        
                        <div className="stat">
                            <div className="stat-title">Distribution</div>
                            <div className="stat-value">{stocks.length}</div>
                            <div className="stat-desc">Rayons avec stock</div>
                        </div>
                        
                        <div className="stat">
                            <div className="stat-title">Alerte</div>
                            <div className="stat-value text-secondary">
                                {stocks.length > 0 ? stocks[0].quantite_alerte : 10}
                            </div>
                            <div className="stat-desc">Seuil minimum</div>
                        </div>
                    </div>
                    
                    <div className="tabs tabs-boxed mb-6">
                        <button
                            className={`tab ${!showTransfert ? 'tab-active' : ''}`}
                            onClick={() => setShowTransfert(false)}
                        >
                            Mouvement de stock
                        </button>
                        <button
                            className={`tab ${showTransfert ? 'tab-active' : ''}`}
                            onClick={() => setShowTransfert(true)}
                        >
                            Transfert entre rayons
                        </button>
                    </div>
                    
                    {!showTransfert ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-base-200 p-4 rounded-box">
                                <h3 className="font-bold text-lg mb-4">Nouveau mouvement</h3>
                                
                                <form onSubmit={handleStockSubmit}>
                                    <input type="hidden" name="produit_id" value={produit.id} />
                                    
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Type de mouvement*</span>
                                        </label>
                                        <select 
                                            name="type" 
                                            className="select select-bordered w-full"
                                            value={mouvementType}
                                            onChange={(e) => setMouvementType(e.target.value)}
                                            required
                                        >
                                            <option value="entree">Entrée</option>
                                            <option value="sortie">Sortie</option>
                                            <option value="ajustement">Ajustement</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Rayon*</span>
                                        </label>
                                        <select 
                                            name="rayon_id" 
                                            className="select select-bordered w-full"
                                            required
                                        >
                                            <option disabled value="">Sélectionnez...</option>
                                            {rayons.map(rayon => (
                                                <option key={rayon.id} value={rayon.id}>
                                                    {rayon.nom} ({rayon.code_emplacement})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">
                                                {mouvementType === 'ajustement' ? 'Nouvelle quantité*' : 'Quantité*'}
                                            </span>
                                        </label>
                                        <input 
                                            type="number" 
                                            name="quantity" 
                                            min="1"
                                            className="input input-bordered w-full" 
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-control mb-6">
                                        <label className="label">
                                            <span className="label-text">Motif</span>
                                        </label>
                                        <textarea 
                                            name="motif" 
                                            className="textarea textarea-bordered" 
                                            placeholder="Raison du mouvement..."
                                        />
                                    </div>
                                    
                                    <button type="submit" className="btn btn-primary w-full">
                                        Enregistrer le mouvement
                                    </button>
                                </form>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <h3 className="font-bold text-lg mb-4">Inventaire par rayon</h3>
                                
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Rayon</th>
                                            <th>Emplacement</th>
                                            <th>Quantité</th>
                                            <th>Alerte</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stocks.map(stock => {
                                            const rayon = rayons.find(r => r.id === stock.rayon_id);
                                            const statut = stock.quantite <= 0 ? 'Rupture' :
                                                stock.quantite <= stock.quantite_alerte ? 'Alerte' : 'OK';
                                            
                                            return (
                                                <tr key={`${stock.produit_id}-${stock.rayon_id}`} className="hover">
                                                    <td>{rayon?.nom}</td>
                                                    <td>{rayon?.code_emplacement}</td>
                                                    <td>{stock.quantite}</td>
                                                    <td>{stock.quantite_alerte}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            statut === 'Rupture' ? 'badge-error' :
                                                            statut === 'Alerte' ? 'badge-warning' : 'badge-success'
                                                        }`}>
                                                            {statut}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {stocks.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    Aucun stock pour ce produit
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-base-200 p-6 rounded-box">
                            <h3 className="font-bold text-lg mb-4">Transfert entre rayons</h3>
                            
                            {rayonsAvecStock.length > 0 ? (
                                <form onSubmit={handleTransfertSubmit}>
                                    <input type="hidden" name="produit_id" value={produit.id} />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Rayon source*</span>
                                            </label>
                                            <select 
                                                name="rayon_source_id" 
                                                className="select select-bordered w-full"
                                                required
                                            >
                                                <option disabled value="">Sélectionnez...</option>
                                                {stocks.filter(s => s.quantite > 0).map(stock => {
                                                    const rayon = rayons.find(r => r.id === stock.rayon_id);
                                                    return (
                                                        <option key={rayon.id} value={rayon.id}>
                                                            {rayon.nom} ({rayon.code_emplacement}) - {stock.quantite} unités
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Rayon destination*</span>
                                            </label>
                                            <select 
                                                name="rayon_destination_id" 
                                                className="select select-bordered w-full"
                                                required
                                            >
                                                <option disabled value="">Sélectionnez...</option>
                                                {rayons.map(rayon => (
                                                    <option key={rayon.id} value={rayon.id}>
                                                        {rayon.nom} ({rayon.code_emplacement})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Quantité à transférer*</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                name="quantite" 
                                                min="1"
                                                className="input input-bordered w-full" 
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Motif</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="motif" 
                                                className="input input-bordered w-full" 
                                                placeholder="Raison du transfert..."
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <button type="submit" className="btn btn-primary">
                                            Effectuer le transfert
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="alert alert-warning">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Aucun stock disponible pour effectuer un transfert.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t">
                    <button onClick={onClose} className="btn btn-primary">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}