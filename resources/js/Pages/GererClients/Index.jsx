import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';

const ClientsIndex = () => {
  
    const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; // ou le nombre d'éléments par page que vous souhaitez




const { clients: initialClients, bestCustomers, flash } = usePage().props;
const [clients, setClients] = useState(initialClients.data);
const [showCreateModal, setShowCreateModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [currentClient, setCurrentClient] = useState(null);
const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'occasionnel',
});

// États pour les filtres et la recherche
const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPurchases: '',
    maxPurchases: '',
    minSpent: '',
    maxSpent: '',
    sortField: 'created_at',
    sortDirection: 'desc'
});

// Fonction pour filtrer les clients
const filteredClients = useMemo(() => {
    let result = [...initialClients.data];
    
    // Filtre par recherche
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            (client.phone && client.phone.toLowerCase().includes(searchTerm)) ||
            (client.email && client.email.toLowerCase().includes(searchTerm)))
    }
    
    // Filtre par type
    if (filters.type) {
        result = result.filter(client => client.type === filters.type);
    }
    
    // Filtre par nombre d'achats
    if (filters.minPurchases) {
        result = result.filter(client => client.purchases >= parseInt(filters.minPurchases));
    }
    if (filters.maxPurchases) {
        result = result.filter(client => client.purchases <= parseInt(filters.maxPurchases));
    }
    
    // Filtre par montant dépensé
    if (filters.minSpent) {
        result = result.filter(client => client.total_spent >= parseFloat(filters.minSpent));
    }
    if (filters.maxSpent) {
        result = result.filter(client => client.total_spent <= parseFloat(filters.maxSpent));
    }
    
    // Tri
    result.sort((a, b) => {
        const field = filters.sortField;
        const direction = filters.sortDirection === 'asc' ? 1 : -1;
        
        if (field === 'name' || field === 'type') {
            return a[field].localeCompare(b[field]) * direction;
        } else {
            return (a[field] - b[field]) * direction;
        }
    });
    
    return result;
}, [initialClients.data, filters]);

    
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        router.post(route('clients.store'), formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    type: 'occasionnel',
                });
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.put(route('clients.update', currentClient.id), formData, {
            onSuccess: () => {
                setShowEditModal(false);
            },
        });
    };

    const openEditModal = (client) => {
        setCurrentClient(client);
        setFormData({
            name: client.name,
            phone: client.phone,
            email: client.email,
            address: client.address,
            type: client.type,
        });
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            router.delete(route('clients.destroy', id));
        }
    };

    
 // Fonction pour exporter en CSV
 const exportToCSV = () => {
    const headers = ['Nom', 'Téléphone', 'Email', 'Type', 'Achats', 'Total dépensé (CDF)', 'Points'];
    const data = filteredClients.map(client => [
        `"${client.name}"`,
        `"${client.phone || ''}"`,
        `"${client.email || ''}"`,
        `"${client.type}"`,
        client.purchases,
        client.total_spent || 0,
        client.solde_points || 0
    ].join(','));

    const csvContent = [
        headers.join(','),
        ...data
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Fonction pour exporter en Excel (utilisant la même méthode que CSV pour simplifier)
const exportToExcel = () => {
    // Préparer les données
    const headers = ['Nom', 'Téléphone', 'Email', 'Type', 'Achats', 'Total dépensé (CDF)', 'Points'];
    const data = filteredClients.map(client => [
        client.name,
        client.phone || '-',
        client.email || '-',
        client.type.charAt(0).toUpperCase() + client.type.slice(1), // Capitalize
        client.purchases,
        { t: 'n', v: client.total_spent || 0, z: '#,##0.00' }, // Format nombre
        { t: 'n', v: client.solde_points || 0 } // Format nombre
    ]);

    // Créer un workbook
    const wb = XLSX.utils.book_new();
    
    // Convertir les données en worksheet avec mise en forme
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    
    // Ajouter des largeurs de colonnes
    ws['!cols'] = [
        { wch: 25 }, // Nom
        { wch: 15 }, // Téléphone
        { wch: 25 }, // Email
        { wch: 12 }, // Type
        { wch: 8 },  // Achats
        { wch: 15 }, // Total dépensé
        { wch: 10 }  // Points
    ];
    
    // Ajouter le worksheet au workbook
    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    
    // Générer le fichier Excel
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `clients_${date}.xlsx`, {
        bookType: 'xlsx',
        type: 'file'
    });
};


  // Recherche avec debounce
  const handleSearch = debounce((value) => {
    setFilters(prev => ({ ...prev, search: value }));
}, 1);

// Réinitialiser les filtres
const resetFilters = () => {
    setFilters({
        search: '',
        type: '',
        minPurchases: '',
        maxPurchases: '',
        minSpent: '',
        maxSpent: '',
        sortField: 'created_at',
        sortDirection: 'desc'
    });
};

// Trier les colonnes
const sortBy = (field) => {
    setFilters(prev => ({
        ...prev,
        sortField: field,
        sortDirection: prev.sortField === field 
            ? prev.sortDirection === 'asc' ? 'desc' : 'asc'
            : 'asc'
    }));
};

// Calcul des clients paginés
const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage]);
  
  // Calcul des liens de pagination
  const paginationLinks = useMemo(() => {
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const links = [];
    
    // Lien précédent
    if (currentPage > 1) {
      links.push({
        url: '#',
        label: '&laquo; Previous',
        active: false,
        onClick: () => setCurrentPage(currentPage - 1)
      });
    }
  
    // Liens des pages
    for (let i = 1; i <= totalPages; i++) {
      links.push({
        url: '#',
        label: i.toString(),
        active: i === currentPage,
        onClick: () => setCurrentPage(i)
      });
    }
  
    // Lien suivant
    if (currentPage < totalPages) {
      links.push({
        url: '#',
        label: 'Next &raquo;',
        active: false,
        onClick: () => setCurrentPage(currentPage + 1)
      });
    }
  
    return links;
  }, [filteredClients.length, currentPage, itemsPerPage]);
    return (
        <AuthenticatedLayout>
            <Head title="Gestion des clients" />

            <div className="p-4">
                

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestion des clients</h1>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Nouveau client
                    </button>
                </div>

                {/* Filtres et recherche */}
                <div className="bg-base-100 rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Recherche</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nom, téléphone ou email"
                                className="input input-bordered w-full"
                                value={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Type de client</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <option value="">Tous les types</option>
                                <option value="occasionnel">Occasionnel</option>
                                <option value="regulier">Régulier</option>
                                <option value="entreprise">Entreprise</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Actions</span>
                            </label>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={resetFilters}
                                    className="btn btn-outline flex-1"
                                >
                                    Réinitialiser
                                </button>
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-outline flex-1">
                                        Exporter
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><button onClick={exportToCSV}>Export CSV</button></li>
                                        <li><button onClick={exportToExcel}>Export Excel</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Achats (min)</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Minimum"
                                className="input input-bordered w-full"
                                value={filters.minPurchases}
                                onChange={(e) => setFilters({ ...filters, minPurchases: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Achats (max)</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Maximum"
                                className="input input-bordered w-full"
                                value={filters.maxPurchases}
                                onChange={(e) => setFilters({ ...filters, maxPurchases: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Total dépensé (min)</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Minimum (CDF)"
                                className="input input-bordered w-full"
                                value={filters.minSpent}
                                onChange={(e) => setFilters({ ...filters, minSpent: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Total dépensé (max)</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Maximum (CDF)"
                                className="input input-bordered w-full"
                                value={filters.maxSpent}
                                onChange={(e) => setFilters({ ...filters, maxSpent: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="lg:col-span-2">
                        <div className="bg-base-100 rounded-lg shadow">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => sortBy('name')}
                                                >
                                                    Nom
                                                    {filters.sortField === 'name' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${filters.sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </th>
                                            <th>Téléphone</th>
                                            <th>Email</th>
                                            <th>
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => sortBy('type')}
                                                >
                                                    Type
                                                    {filters.sortField === 'type' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${filters.sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </th>
                                            <th>
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => sortBy('purchases')}
                                                >
                                                    Achats
                                                    {filters.sortField === 'purchases' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${filters.sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </th>
                                            <th>
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => sortBy('total_spent')}
                                                >
                                                    Total dépensé
                                                    {filters.sortField === 'total_spent' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${filters.sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClients.map((client) => (
                                            <tr key={client.id}>
                                                <td>{client.name}</td>
                                                <td>{client.phone || '-'}</td>
                                                <td>{client.email || '-'}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        client.type === 'entreprise' ? 'badge-primary' : 
                                                        client.type === 'regulier' ? 'badge-secondary' : 'badge-accent'
                                                    }`}>
                                                        {client.type}
                                                    </span>
                                                </td>
                                                <td>{client.purchases}</td>
                                                <td>{client.total_spent ? `${client.total_spent} CDF` : '-'}</td>
                                                <td>
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            onClick={() => openEditModal(client)}
                                                            className="btn btn-sm btn-ghost"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(client.id)}
                                                            className="btn btn-sm btn-ghost text-error"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                   

                </div>

                <div>
                        <div className="bg-base-100 rounded-lg shadow p-6 mt-6">
                            <h2 className="text-xl font-bold mb-4">Top clients</h2>
                            <div className="space-y-4">
                                {bestCustomers.map((customer, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{customer.name}</h3>
                                            <p className="text-sm text-gray-500">{customer.purchases} achats</p>
                                        </div>
                                        <span className="font-bold">{customer.total_spent} CDF</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                {/* Modales (inchangées) */}
                <div className={`modal ${showCreateModal ? 'modal-open' : ''}`}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Créer un nouveau client</h3>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Nom complet</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Téléphone</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Adresse</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Type de client</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="occasionnel">Occasionnel</option>
                                    <option value="regulier">Régulier</option>
                                    <option value="entreprise">Entreprise</option>
                                </select>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => setShowCreateModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Créer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* ... (garder les mêmes modales que dans votre code original) ... */}
                <div className={`modal ${showEditModal ? 'modal-open' : ''}`}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Modifier le client</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Nom complet</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Téléphone</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Adresse</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Type de client</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="occasionnel">Occasionnel</option>
                                    <option value="regulier">Régulier</option>
                                    <option value="entreprise">Entreprise</option>
                                </select>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => setShowEditModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClientsIndex;