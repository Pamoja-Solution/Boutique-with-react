import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function EditUser({ auth, user, roles }) {
    const fileInputRef = useRef(null);
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role_id: user.role_id,
        photo: null,  // Ne pas mettre user.photo ici
        _method: 'PUT'
    });

    const [previewImage, setPreviewImage] = useState(
        user.photo ? `${user.photo}` : '/images/default-avatar.png'
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setData('photo', null);
            setPreviewImage(user.photo ? `${user.photo}` : '/images/default-avatar.png');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('role_id', data.role_id || '');

        if (data.password) {
            formData.append('password', data.password);
            formData.append('password_confirmation', data.password_confirmation);
        }

        // Ajouter la photo seulement si un nouveau fichier est sélectionné
        if (data.photo instanceof File) {
            formData.append('photo', data.photo);
        }

        post(route('users.update', user.id), {
            data: formData,
            preserveScroll: true,
            onError: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-base-content leading-tight">
                        Modifier {user.name}
                    </h2>
                    <Link href={route('users.index')} className="btn btn-ghost">
                        Retour à la liste
                    </Link>
                </div>
            }
        >
            <Head title={`Modifier ${user.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-base-100 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {recentlySuccessful && (
                                <div className="alert alert-success mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Modifications enregistrées avec succès!</span>
                                </div>
                            )}

                            <form onSubmit={submit} encType="multipart/form-data">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Colonne gauche - Informations de base */}
                                    <div className="space-y-6">
                                        <div className="form-control">
                                            <InputLabel htmlFor="name" value="Nom complet *" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                className="input input-bordered w-full"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-1" />
                                        </div>

                                        <div className="form-control">
                                            <InputLabel htmlFor="email" value="Email *" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="input input-bordered w-full"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-1" />
                                        </div>

                                        <div className="form-control">
                                            <InputLabel htmlFor="role_id" value="Rôle" />
                                            <select
                                                id="role_id"
                                                className="select select-bordered w-full"
                                                value={data.role_id}
                                                onChange={(e) => setData('role_id', e.target.value)}
                                            >
                                                <option value="">Sélectionner un rôle</option>
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.role_id} className="mt-1" />
                                        </div>
                                    </div>

                                    {/* Colonne droite - Photo */}
                                    <div className="space-y-6">
                                        <div className="form-control">
                                            <InputLabel value="Photo de profil" />
                                            <div className="flex flex-col items-center">
                                                <div className="avatar mb-4">
                                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                        <img 
                                                            src={previewImage} 
                                                            alt="Photo de profil" 
                                                            onError={(e) => {
                                                                e.target.src = '/images/default-avatar.png';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <label className="btn btn-outline">
                                                    {data.photo instanceof File ? 'Photo sélectionnée' : 'Changer la photo'}
                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef}
                                                        className="hidden" 
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                </label>
                                                {data.photo instanceof File && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-xs mt-2"
                                                        onClick={() => {
                                                            setData('photo', null);
                                                            setPreviewImage(user.photo ? `/storage/${user.photo}` : '/images/default-avatar.png');
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = '';
                                                            }
                                                        }}
                                                    >
                                                        Annuler la sélection
                                                    </button>
                                                )}
                                                <InputError message={errors.photo} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section mot de passe */}
                                <div className="mt-8 p-6 bg-base-200 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">Changer le mot de passe</h3>
                                    <div className="space-y-4">
                                        <div className="form-control">
                                            <InputLabel htmlFor="password" value="Nouveau mot de passe" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                className="input input-bordered w-full"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <InputError message={errors.password} className="mt-1" />
                                        </div>

                                        <div className="form-control">
                                            <InputLabel htmlFor="password_confirmation" value="Confirmation" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                className="input input-bordered w-full"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8 space-x-4">
                                    <Link 
                                        href={route('users.index')} 
                                        className="btn btn-ghost"
                                    >
                                        Annuler
                                    </Link>
                                    <PrimaryButton type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Enregistrement...
                                            </>
                                        ) : 'Enregistrer les modifications'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}