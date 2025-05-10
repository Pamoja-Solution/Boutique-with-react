import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { toast } from 'react-hot-toast';

export default function ClientSearch({ clientsInitiaux = [], onSelectClient, selectedClient }) {
    const [search, setSearch] = useState('');
    const [clients, setClients] = useState(clientsInitiaux);
    const [loading, setLoading] = useState(false);
    const [nouveauClient, setNouveauClient] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [showForm, setShowForm] = useState(false);

    // Recherche instantanée avec debounce optimisé
    const searchClients = async (term) => {
        try {
            setLoading(true);
            const response = await axios.post(route('point-de-vente.search-clients'), { 
                search: term 
            });
            setClients(response.data);
        } catch (error) {
            toast.error('Erreur lors de la recherche');
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce optimisé avec cleanup
    useEffect(() => {
        // Dans la fonction debouncedSearch
        const debouncedSearch = debounce(async (term) => {
            if (term.length > 0) { // Recherche dès le premier caractère
                setLoading(true);
                try {
                    const response = await axios.get(route('point-de-vente.search-clients'), {
                        params: { search: term } // Envoie le paramètre en GET
                    });
                    
                    if (response.data.success) {
                        setClients(response.data.data);

                    } else {
                        toast.error(response.data.message);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    toast.error('Erreur de connexion au serveur');
                } finally {
                    setLoading(false);
                }
            } else {
                setClients(clientsInitiaux || []);
            }
        }, 300);

        debouncedSearch(search);
        
        return () => {
            debouncedSearch.cancel();
        };
    }, [search]);

    const handleClientCreate = () => {
        if (!nouveauClient.name) {
            toast.error('Le nom est obligatoire');
            return;
        }
        
        // Validation du téléphone
        if (nouveauClient.phone && !/^\+?[0-9]{8,15}$/.test(nouveauClient.phone)) {
            toast.error('Numéro de téléphone invalide');
            return;
        }
        
        onSelectClient({
            id: null, // Sera créé côté serveur
            ...nouveauClient
        });
        +   toast.success(`Nouveau client "${nouveauClient.name}" ajouté`);
        setNouveauClient({ name: '', phone: '', email: '' });
        setShowForm(false);
        setSearch(''); // Réinitialiser la recherche après création
    };

    return (
        <div className="card bg-base-100 shadow p-4">
            <h2 className="text-lg font-bold mb-4">Client</h2>
            
            {selectedClient ? (
                <div className="alert bg-base-200 shadow-sm flex justify-between items-center">
                    <div>
                        <h3 className="font-bold">{selectedClient.name}</h3>
                        {selectedClient.phone && <p className="text-sm">{selectedClient.phone}</p>}
                        {selectedClient.email && <p className="text-sm">{selectedClient.email}</p>}
                    </div>
                    <button 
                        onClick={() => onSelectClient(null)} 
                        className="btn btn-sm btn-circle"
                        aria-label="Désélectionner le client"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input input-bordered w-full pr-10"
                            autoComplete="off"
                        />
                        {loading && (
                            <span className="loading loading-spinner loading-xs absolute right-3 top-3" />
                        )}
                    </div>

                    {/* Liste des résultats */}
                    <div className="max-h-60 overflow-y-auto">
                        {clients.length > 0 ? (
                            <ul className="divide-y">
                                {clients.map(client => (
                                    <li
                                        key={client.id}
                                        onClick={() => {onSelectClient(client);
                                            +       toast.success(`Client "${client.name}" sélectionné`);
                                        }}
                                        className="p-2 hover:bg-base-200 cursor-pointer"
                                    >
                                        <p className="font-medium">{client.name}</p>
                                        {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : search.length > 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                {loading ? 'Recherche en cours...' : 'Aucun client trouvé'}
                            </div>
                        ) : null}
                    </div>

                    {/* Formulaire nouveau client */}
                    {showForm ? (
                        <div className="mt-4 border-t pt-4 space-y-3">
                            <h3 className="text-sm font-medium">Nouveau Client</h3>
                            
                            <input
                                type="text"
                                placeholder="Nom complet *"
                                value={nouveauClient.name}
                                onChange={(e) => setNouveauClient(prev => ({ ...prev, name: e.target.value }))}
                                className="input input-bordered input-sm w-full"
                                autoFocus
                            />
                            
                            <input
                                type="text"
                                placeholder="Téléphone"
                                value={nouveauClient.phone}
                                onChange={(e) => setNouveauClient(prev => ({ ...prev, phone: e.target.value }))}
                                className="input input-bordered input-sm w-full"
                            />
                            
                            <input
                                type="email"
                                placeholder="Email"
                                value={nouveauClient.email}
                                onChange={(e) => setNouveauClient(prev => ({ ...prev, email: e.target.value }))}
                                className="input input-bordered input-sm w-full"
                            />
                            
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleClientCreate}
                                    disabled={!nouveauClient.name}
                                    className="btn btn-primary btn-sm flex-1"
                                >
                                    Ajouter
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="btn btn-outline btn-sm"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn btn-outline btn-sm mt-4 w-full"
                        >
                            + Nouveau client
                        </button>
                    )}
                </>
            )}
        </div>
    );
}