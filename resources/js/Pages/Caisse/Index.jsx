import React from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function CaisseIndex({ caisses }) {
    const { flash } = usePage().props;

    React.useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const toggleStatus = (caisse) => {
        router.post(route('caisses.toggle-status', caisse.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestion des Caisses" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Gestion des Caisses</h1>
                    <Link href={route('caisses.create')} className="btn btn-primary">
                        Créer une nouvelle caisse
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Devise</th>
                                <th>Solde Initial</th>
                                <th>Solde Actuel</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {caisses.map((caisse) => (
                                <tr key={caisse.id}>
                                    <td>{caisse.name}</td>
                                    <td>{caisse.devise.symbole} ({caisse.devise.code})</td>
                                    <td>{caisse.solde_initial.toFixed(2)} {caisse.devise.symbole} </td>
                                    <td className={
                                        caisse.solde_actuel < caisse.solde_initial ? 'text-error' : 'text-success'
                                    }>
                                        {caisse.solde_actuel.toFixed(2)}
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            caisse.is_active ? 'badge-success' : 'badge-error'
                                        }`}>
                                            {caisse.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <Link 
                                            href={route('caisses.edit', caisse.id)}
                                            className="btn btn-sm btn-info"
                                        >
                                            Éditer
                                        </Link>
                                        <button
                                            onClick={() => toggleStatus(caisse)}
                                            className={`btn btn-sm ${
                                                caisse.is_active ? 'btn-warning' : 'btn-success'
                                            }`}
                                        >
                                            {caisse.is_active ? 'Fermer' : 'Ouvrir'}
                                        </button>
                                        {!caisse.is_active && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Supprimer cette caisse ?')) {
                                                        Inertia.delete(route('caisses.destroy', caisse.id));
                                                    }
                                                }}
                                                className="btn btn-sm btn-error"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                        <Link 
                                            href={route('caisses.mouvements.index', caisse.id)}
                                            className="btn btn-sm btn-neutral"
                                        >
                                            Mouvements
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}