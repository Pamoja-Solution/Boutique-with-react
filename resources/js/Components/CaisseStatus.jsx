import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';

export default function CaisseStatus() {
    const { lescaisses, lacaisse } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'entree',
        montant: '',
        description: ''
    });

    // Si aucune caisse n'est disponible
    if (!lescaisses || lescaisses.length === 0) {
        return (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 text-sm">
                <div className="w-2 h-2 bg-error rounded-full"></div>
                <span>Aucune caisse disponible</span>
            </div>
        );
    }

    // Trouver la caisse active (ou la première par défaut)
    const activeCaisse = lacaisse || lescaisses.find(c => c.is_active) || lescaisses[0];
    
    const soldeFormatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency:'CDF',
        minimumFractionDigits: 2
    }).format(activeCaisse.solde_actuel);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('caisses.mouvements.store', activeCaisse.id), {
            ...formData,
            montant: formData.type === 'sortie' ? -Math.abs(formData.montant) : Math.abs(formData.montant)
        }, {
            onSuccess: () => {
                setShowModal(false);
                setFormData({
                    type: 'entree',
                    montant: '',
                    description: ''
                });
            }
        });
    };

    return (
        <div className="dropdown dropdown-end hidden md:block">
            <button tabIndex={0} className="btn btn-sm btn-ghost gap-2">
                <div className={`w-2 h-2 rounded-full ${activeCaisse.is_active ? 'bg-success' : 'bg-warning'}`}></div>
                <span>{activeCaisse.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            
            <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                <div className="p-2">
                    <p className="text-xs opacity-70 mb-1">Solde actuel:</p>
                    <p className="font-semibold text-lg">{soldeFormatted}</p>
                    
                    <div className="divider my-1"></div>
                    
                    <div className="flex flex-col gap-1">
                        {/* Liste des autres caisses disponibles */}
                        {lescaisses.filter(c => c.id !== activeCaisse.id).map(caisse => (
                            <Link 
                                key={caisse.id} 
                                href={route('caisses.switch', caisse.id)}
                                method="post"
                                as="button"
                                className="btn btn-xs btn-ghost justify-start"
                            >
                                <div className={`w-2 h-2 rounded-full mr-2 ${caisse.is_active ? 'bg-success' : 'bg-warning'}`}></div>
                                {caisse.name}
                            </Link>
                        ))}
                        
                        <div className="divider my-1"></div>
                        
                        <button 
                            onClick={() => setShowModal(true)}
                            className="btn btn-xs btn-ghost justify-start"
                        >
                            Ajouter un mouvement
                        </button>
                        
                            <>
                                <Link 
                                    href={route('caisses.close', activeCaisse.id)}
                                    method="post"
                                    as="button"
                                    className="btn btn-xs btn-ghost justify-start text-error"
                                >
                                    Fermer la caisse
                                </Link>
                            </>
                    </div>
                </div>
            </div>

            {/* Modal pour nouveau mouvement */}
            <dialog id="mouvement_modal" className={`modal ${showModal ? 'modal-open' : ''}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Ajouter un mouvement</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Type</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                required
                            >
                                <option value="entree">Entrée</option>
                                <option value="sortie">Sortie</option>
                            </select>
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Montant ({activeCaisse.devise.symbole})</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="input input-bordered w-full"
                                value={formData.montant}
                                onChange={(e) => setFormData({...formData, montant: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>

                        <div className="modal-action">
                            <button 
                                type="button" 
                                className="btn"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
}