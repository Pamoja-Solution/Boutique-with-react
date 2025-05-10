import DevisesForm from "@/Components/LesForms/DevisesForm";
import Devise from "@/Components/LesForms/Devise";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";

export default function Monnaie({ devises}) {
    const { put } = useForm();
    const { auth } = usePage().props;

    const { user } = auth;

    const handleDeactivate = (userId) => {
        if (confirm('Désactiver cette Monnaie ?')) {
            put(route('currencies.desactivate', userId));
        }
    };

    const handleActivate = (userId) => {
        put(route('currencies.restore', userId));
    };
    return(
        <AuthenticatedLayout>
            <Head title="Point de Vente" />
            

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Produits les plus vendus */}
                                    <div className="card bg-base-100 shadow-xl">
                                        <div className="card-body">
                                            <h2 className="card-title">Nouvelle Devise </h2>
                                            <span className="text-xs">(les Prix dependent du dollars)</span>
                                            <div className="overflow-x-auto">
                                            <DevisesForm/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clients fidèles */}
                                    <div className="card bg-base-100 shadow-xl">
                                        <div className="card-body">
                                            <h2 className="card-title">Taux</h2>
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra table-sm">
                                                    <thead >
                                                        <tr>
                                                            <th>Client</th>
                                                            <th>Achats</th>
                                                            <th>Valeur</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {devises.data.map((devise)=>(
                                                            <tr>
                                                                <td className="flex items-center gap-2">
                                                                    <div className="avatar placeholder">
                                                                        <div className="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                                                                            <span className="text-xs">{devise.symbole}</span>
                                                                        </div>
                                                                    </div>
                                                                    <span>{devise.code}</span>
                                                                </td>
                                                                <td>{devise.taux_achat}</td>
                                                                <td>1$</td>
                                                            </tr>
                                                        ))}

                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container">
                                <table className="table table-zebra table-sm">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Symbole</th>
                                            <th>taux Ac</th>
                                            <th>taux Ven</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {devises.data.map((devise)=>(
                                            <tr>
                                                <td>{devise.code}</td>
                                                <td>{devise.symbole}</td>
                                                <td>{devise.taux_achat}</td>
                                                <td>{devise.taux_vente}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                {devise.is_default ? (
                                                    <>
                                                        <span className="text-green-600">Actif</span>
                                                        {auth.user.permissions.users.delete && (
                                                            <button
                                                                onClick={() => handleDeactivate(user.id)}
                                                                className="ml-2 text-red-600 hover:text-red-800"
                                                            >
                                                                Désactiver
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-red-600">Inactif </span>
                                                        {auth.user.permissions.users.restore && (
                                                            <button
                                                                onClick={() => handleActivate(devise.id)}
                                                                className="ml-2 text-green-600 hover:text-green-800"
                                                            >
                                                                Réactiver
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                            </tr>
                                        ))}
                                        
                                        
                                    </tbody>
                                </table>
                                </div>
        </AuthenticatedLayout>
    )
}
