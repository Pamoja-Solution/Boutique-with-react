import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function DetailsModal({ venteId, show, onClose }) {
    const { props } = usePage();
    const [vente, setVente] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (show && venteId) {
            fetchVenteDetails();
        }
    }, [show, venteId]);

    const fetchVenteDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/laventes/${venteId}/details`);
            setVente(response.data.vente);
        } catch (error) {
            toast.error('Erreur lors du chargement des détails');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog open={show} className="modal modal-bottom sm:modal-middle bg-base-100">
            <div className="modal-box max-w-5xl bg-base-100">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <>
                        <h3 className="font-bold text-xl mb-4">Détails de la Vente #{vente?.code}</h3>
                        
                        {/* Infos générales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                                <p><span className="font-semibold">Client:</span> {vente?.client?.name || 'Non spécifié'}</p>
                                <p><span className="font-semibold">Date:</span> {new Date(vente?.created_at).toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Total:</span> {vente?.montant_total} {props.currency || 'FC'}</p>
                                <p>
                                    <span className="font-semibold">Statut:</span> 
                                    <span className={`badge ml-2 ${vente?.statut === 'payé' ? 'badge-success' : 'badge-warning'}`}>
                                        {vente?.statut}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Tableau des articles */}
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th className="text-right">Qté</th>
                                        <th className="text-right">Prix Unitaire</th>
                                        <th className="text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vente?.articles?.map((article) => (
                                        <tr key={article.id}>
                                            <td>{article.produit?.nom}</td>
                                            <td className="text-right">{article.quantite}</td>
                                            <td className="text-right">{article.prix_unitaire} {props.currency || 'FC'}</td>
                                            <td className="text-right font-medium">
                                                {(article.quantite * article.prix_unitaire).toFixed(2)} {props.currency || 'FC'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="3">Total Général</th>
                                        <th className="text-right">
                                            {vente?.articles?.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0).toFixed(2)} {props.currency || 'FC'}
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </>
                )}

                <div className="modal-action">
                    <button onClick={onClose} className="btn">
                        Fermer
                    </button>
                </div>
            </div>
            
            {/* Fermer en cliquant à l'extérieur */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>fermer</button>
            </form>
        </dialog>
    );
}