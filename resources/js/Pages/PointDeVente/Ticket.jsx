import React from 'react';
import { Head } from '@inertiajs/react';

export default function Ticket({ vente, entreprise }) {
    return (
        <div className="p-4 max-w-md mx-auto">
            <Head title={`Ticket de vente #${vente.id}`} />
            
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold">{entreprise.nom}</h1>
                <figure>
                <img
                  src={entreprise.logo}
                  alt="Shoes" />
              </figure>
                <p className="text-sm">{entreprise.adresse}</p>
                <p className="text-sm">{entreprise.telephone}</p>
            </div>

            <div className="border-t border-b py-2 my-2">
                <div className="flex justify-between">
                    <span className="font-medium">Ticket #</span>
                    <span>{vente.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{new Date(vente.created_at).toLocaleString()}</span>
                </div>
                {vente.client && (
                    <div className="flex justify-between">
                        <span className="font-medium">Client:</span>
                        <span>{vente.client.name}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="font-medium">Vendeur:</span>
                    <span>{vente.user.name}</span>
                </div>
            </div>

            <div className="my-4">
                <h2 className="font-bold text-center mb-2">ARTICLES</h2>
                {vente.articles.map((article, index) => (
                    <div key={index} className="flex justify-between py-1 border-b">
                        <div>
                            <p>{article.produit.nom}</p>
                            <p className="text-sm text-gray-500">
                                {article.quantite} × {article.prix_unitaire.toFixed(2)} ({article.type_vente})
                            </p>
                        </div>
                        <p>{article.montant_ttc.toFixed(2)}</p>
                    </div>
                ))}
            </div>

            <div className="border-t border-b py-2 my-2">
                <div className="flex justify-between font-medium">
                    <span>Total HT:</span>
                    <span>{vente.total_ht.toFixed(2)} CDF</span>
                </div>
                <div className="flex justify-between">
                    <span>TVA:</span>
                    <span>{vente.total_tva.toFixed(2)} CDF</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total TTC:</span>
                    <span>{vente.total_ttc.toFixed(2)} CDF</span>
                </div>
                <div className="flex justify-between">
                    <span>Montant payé:</span>
                    <span>{vente.montant_paye.toFixed(2)} CDF</span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>Monnaie rendue:</span>
                    <span>{vente.montant_remise.toFixed(2)} CDF</span>
                </div>
            </div>

            <div className="text-center mt-6 text-sm">
                <p>Merci pour votre achat !</p>
                <p className="mt-2">** {new Date().toLocaleDateString()} **</p>
            </div>

            <div className="text-center mt-8">
                <button 
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Imprimer le ticket
                </button>
            </div>
        </div>
    );
}