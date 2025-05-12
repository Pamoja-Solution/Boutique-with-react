import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import DatePicker from '@/Components/DatePicker';

export default function Form({ auth, depense = null, devises, modesPaiement }) {
    const { data, setData, post, put, processing, errors } = useForm({
        montant: depense?.montant || '',
        devise_id: depense?.devise_id || devises[0]?.id || '',
        description: depense?.description || '',
        mode_paiement: depense?.mode_paiement || modesPaiement[0],
        beneficiaire: depense?.beneficiaire || '',
        //date_depense: depense?.date_depense || new Date().toISOString().split('T')[0],
        date_depense: depense?.date_depense 
        ? new Date(depense.date_depense).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    });

    const submit = (e) => {
        e.preventDefault();
        if (depense) {
            put(route('depenses.update', depense.id));
        } else {
            post(route('depenses.store'));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={depense ? "Modifier Dépense" : "Nouvelle Dépense"} />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {depense ? "Modifier Dépense" : "Nouvelle Dépense"}
                    </h1>
                    <Link 
                        href={route('depenses.index')} 
                        className="btn btn-ghost"
                    >
                        Retour
                    </Link>
                </div>

                <div className="bg-base-100 rounded-lg shadow p-6">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Montant"
                                type="number"
                                step="0.01"
                                value={data.montant}
                                onChange={(e) => setData('montant', e.target.value)}
                                error={errors.montant}
                                required
                            />

                            <Select
                                label="Devise"
                                value={data.devise_id}
                                onChange={(e) => setData('devise_id', e.target.value)}
                                error={errors.devise_id}
                                required
                            >
                                {devises.map((devise) => (
                                    <option key={devise.id} value={devise.id}>
                                        {devise.code} - {devise.nom}
                                    </option>
                                ))}
                            </Select>

                            <div className="md:col-span-2">
                                <Input
                                    label="Description"
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                    required
                                />
                            </div>

                            <Select
                                label="Mode de Paiement"
                                value={data.mode_paiement}
                                onChange={(e) => setData('mode_paiement', e.target.value)}
                                error={errors.mode_paiement}
                                required
                            >
                                {modesPaiement.map((mode) => (
                                    <option key={mode} value={mode}>
                                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                    </option>
                                ))}
                            </Select>

                            <Input
                                label="Bénéficiaire (optionnel)"
                                type="text"
                                value={data.beneficiaire}
                                onChange={(e) => setData('beneficiaire', e.target.value)}
                                error={errors.beneficiaire}
                            />

                            
                            <DatePicker
                                label="Date de la Dépense"
                                value={data.date_depense}
                                onChange={(date) => {
                                    // S'assurer que la date est au bon format
                                    const formattedDate = new Date(date).toISOString().split('T')[0];
                                    setData('date_depense', formattedDate);
                                }}
                                error={errors.date_depense}
                                required
                            />
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                {depense ? "Mettre à jour" : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}