import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from "react";
import { Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('login');
    const { auth } = usePage().props;
    const { user } = auth;

    // Formulaires
    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submitLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onFinish: () => registerForm.reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Accueil - Ma Boutique" />

            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
                <div className="w-full max-w-md bg-base-200 rounded-lg shadow-lg overflow-hidden">
                    {/* En-tête avec onglets */}
                    <div className="tabs tabs-boxed bg-base-300 justify-center p-2">
                        <button
                            className={`tab ${activeTab === 'login' ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Connexion
                        </button>
                        {!user && (
                            <button
                                className={`tab ${activeTab === 'register' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('register')}
                            >
                                Inscription
                            </button>
                        )}
                    </div>

                    {/* Contenu des onglets */}
                    <div className="p-6">
                        {user ? (
                            // Utilisateur connecté
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">Bienvenue, {user.name}!</h2>
                                <p className="mb-6">Vous êtes connecté à votre espace boutique.</p>
                                <div className="flex flex-col gap-3">
                                    <Link 
                                        href={route('dashboard')} 
                                        className="btn btn-primary"
                                    >
                                        Tableau de bord
                                    </Link>
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="btn btn-ghost"
                                    >
                                        Déconnexion
                                    </Link>
                                </div>
                            </div>
                        ) : activeTab === 'login' ? (
                            // Formulaire de connexion
                            <form onSubmit={submitLogin}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={loginForm.data.email}
                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={loginForm.errors.email} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="password" value="Mot de passe" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={loginForm.data.password}
                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={loginForm.errors.password} className="mt-2" />
                                </div>

                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={loginForm.data.remember}
                                            onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                            className="checkbox checkbox-primary checkbox-sm"
                                        />
                                        <span className="ml-2 text-sm">Se souvenir de moi</span>
                                    </label>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <PrimaryButton className="w-full" disabled={loginForm.processing}>
                                        {loginForm.processing ? 'Connexion...' : 'Se connecter'}
                                    </PrimaryButton>

                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-primary hover:underline text-center"
                                    >
                                        Mot de passe oublié?
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            // Formulaire d'inscription
                            <form onSubmit={submitRegister}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="name" value="Nom" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={registerForm.data.name}
                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={registerForm.errors.name} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={registerForm.data.email}
                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={registerForm.errors.email} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="password" value="Mot de passe" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={registerForm.data.password}
                                        onChange={(e) => registerForm.setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={registerForm.errors.password} className="mt-2" />
                                </div>

                                <div className="mb-6">
                                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={registerForm.data.password_confirmation}
                                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={registerForm.errors.password_confirmation} className="mt-2" />
                                </div>

                                <PrimaryButton className="w-full" disabled={registerForm.processing}>
                                    {registerForm.processing ? 'Inscription...' : "S'inscrire"}
                                </PrimaryButton>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}