import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function UsersIndex({ auth, users, roles }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        photo: null,
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        photo: null,
        _method: 'PUT' // Important pour les mises à jour
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };
    const openDeleteModal = (user) => {
        setCurrentUser(user);
        setShowDeleteModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        
        // Créer un FormData et ajouter toutes les données
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', editForm.data.name);
        formData.append('email', editForm.data.email);
        formData.append('role_id', editForm.data.role_id || '');
        
        // Ajouter le mot de passe seulement si fourni
        if (editForm.data.password) {
            formData.append('password', editForm.data.password);
            formData.append('password_confirmation', editForm.data.password_confirmation);
        }
        
        // Ajouter la photo seulement si une nouvelle est fournie
        if (editForm.data.photo) {
            formData.append('photo', editForm.data.photo);
        }
    
        // Envoyer la requête
        editForm.put(route('users.update', currentUser.id), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                setCurrentUser(null);
            },
        });
    };

    const handleDelete = () => {
        editForm.delete(route('users.destroy', currentUser.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setCurrentUser(null);
            },
        });
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role_id: user.role_id,
            photo: null,
        });
        setShowEditModal(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-base-content leading-tight">Gestion des utilisateurs</h2>}
        >
            <Head title="Gestion des utilisateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-base-100 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Liste des utilisateurs</h3>
                                <button 
                                    onClick={() => setShowCreateModal(true)}
                                    className="btn btn-primary"
                                >
                                    Ajouter un utilisateur
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Email</th>
                                            <th>Rôle</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        {user.photo && (
                                                            <div className="avatar">
                                                                <div className="w-10 rounded-full">
                                                                    <img src={`${user.photo}`} alt={user.name} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-bold">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{user.role?.name || 'Aucun rôle'}</td>
                                                <td className="flex gap-2">
                                                <Link 
                                                        href={route('users.edit', user.id)}
                                                        className="btn btn-sm btn-ghost"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <button 
                                                        onClick={() => openDeleteModal(user)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.is_active ? (
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
                                                    onClick={() => handleActivate(user.id)}
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de création */}
            <dialog open={showCreateModal} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Ajouter un nouvel utilisateur</h3>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="form-control w-full mb-4">
                            <InputLabel htmlFor="name" value="Nom complet" />
                            <TextInput
                                id="name"
                                type="text"
                                className="input input-bordered w-full"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.name} className="mt-1" />
                        </div>

                        <div className="form-control w-full mb-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="input input-bordered w-full"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.email} className="mt-1" />
                        </div>

                        <div className="form-control w-full mb-4">
                            <InputLabel htmlFor="password" value="Mot de passe" />
                            <TextInput
                                id="password"
                                type="password"
                                className="input input-bordered w-full"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.password} className="mt-1" />
                        </div>

                        <div className="form-control w-full mb-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirmation mot de passe" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="input input-bordered w-full"
                                value={createForm.data.password_confirmation}
                                onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control w-full mb-4">
                            <InputLabel htmlFor="role_id" value="Rôle" />
                            <select
                                id="role_id"
                                className="select select-bordered w-full"
                                value={createForm.data.role_id}
                                onChange={(e) => createForm.setData('role_id', e.target.value)}
                            >
                                <option value="">Sélectionner un rôle</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            <InputError message={createForm.errors.role_id} className="mt-1" />
                        </div>

                        <div className="form-control w-full mb-6">
                            <InputLabel htmlFor="photo" value="Photo de profil" />
                            <input
                                type="file"
                                id="photo"
                                className="file-input file-input-bordered w-full"
                                onChange={(e) => createForm.setData('photo', e.target.files[0])}
                            />
                            <InputError message={createForm.errors.photo} className="mt-1" />
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    createForm.reset();
                                }}
                            >
                                Annuler
                            </button>
                            <PrimaryButton type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Création...' : 'Créer'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </dialog>

            

            {/* Modal de suppression */}
            <dialog open={showDeleteModal} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Confirmer la suppression</h3>
                    <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {currentUser?.name} ?
                    </p>
                    <p className='text-red-500 text-center font-bold mt-2'>
                        Il serait mieux de le desactiver car toutes les données lui concernant seront aussi supprimer
                    </p>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Annuler
                        </button>
                        <DangerButton
                            onClick={handleDelete}
                            disabled={editForm.processing}
                        >
                            {editForm.processing ? 'Suppression...' : 'Supprimer'}
                        </DangerButton>
                    </div>
                </div>
            </dialog>
        </AuthenticatedLayout>
    );
}