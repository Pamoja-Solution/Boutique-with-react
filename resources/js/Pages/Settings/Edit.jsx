import React, { useEffect, useState } from 'react';
import { usePage, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';
import useTheme from '@/hooks/useTheme';

export default function UserSettingsEdit({ 
    initialSettings, 
    availableThemes, 
    availableFonts 
}) {
    const { flash } = usePage().props;
    const [theme, setTheme] = useTheme(initialSettings.theme);
    const [settings, setSettings] = useState(initialSettings);

    // Synchronise le thème quand initialSettings change
    useEffect(() => {
        if (initialSettings.theme !== theme) {
            setTheme(initialSettings.theme);
        }
    }, [initialSettings.theme]);
    
    // Applique la police
    useEffect(() => {
        const applyFont = (font) => {
            // Liste de toutes les classes de police à supprimer
            const allFontClasses = [
                'font-sans', 'font-serif', 'font-mono', 'font-rounded',
                'font-ubuntu', 'font-dancing', 'font-comfortaa',
                'font-poppins', 'font-roboto', 'font-montserrat',
                'font-playfair', 'font-lato', 'font-raleway',
                'font-nunito', 'font-pacifico', 'font-oswald',
                'font-quicksand'
            ];
    
            // Supprimer toutes les classes de police
            document.documentElement.classList.remove(...allFontClasses);
            
            // Ajouter la police sélectionnée
            document.documentElement.classList.add(`font-${font}`);
            localStorage.setItem('font', font);
        };
    
        applyFont(settings.font);
    }, [settings.font]);

    // Gestion des notifications
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('user-settings.update'), { 
            ...settings, 
            theme 
        }, {
            preserveScroll: true,
        });
    };
    
    return (
        <AuthenticatedLayout>
            <Head title="Paramètres Utilisateur" />

            <div className="container mx-auto px-4 py-8">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h1 className="card-title text-2xl mb-6">Paramètres Utilisateur</h1>
                        
                        <form onSubmit={handleSubmit}>
                            {/* Sélection du thème */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Thème de l'application</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {availableThemes.map(themeOption => (
                                        <div 
                                            key={themeOption}
                                            data-theme={themeOption}
                                            className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                                theme === themeOption ? 'border-primary' : 'border-base-200'
                                            }`}
                                            onClick={() => setTheme(themeOption)}
                                        >
                                            <div className="p-2">
                                                <div className="flex gap-1 mb-1">
                                                    {/* Utilisation des couleurs du thème actuel grâce à data-theme */}
                                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                                                    <div className="w-3 h-3 rounded-full bg-neutral"></div>
                                                </div>
                                                <div className="flex gap-1 mb-1">
                                                    <div className="w-3 h-3 rounded-full bg-info"></div>
                                                    <div className="w-3 h-3 rounded-full bg-success"></div>
                                                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                                                    <div className="w-3 h-3 rounded-full bg-error"></div>
                                                </div>
                                                <div className="h-8 rounded bg-base-200 relative">
                                                    <div className="h-2/3 w-1/3 rounded absolute top-1 left-1 bg-base-content opacity-20"></div>
                                                </div>
                                                <span className="block text-center mt-1 text-sm capitalize text-base-content">
                                                    {themeOption}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sélection de la police */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Police d'écriture</h2>
                                <div className="flex flex-wrap gap-4">
                                    {Object.entries(availableFonts).map(([value, label]) => (
                                        <div 
                                            key={value}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                settings.font === value ? 'border-primary' : 'border-base-200'
                                            } font-${value}`}
                                            onClick={() => setSettings(prev => ({ ...prev, font: value }))}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Autres paramètres */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Préférences</h2>
                                
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Mode compact</span>
                                        <input 
                                            type="checkbox" 
                                            className="toggle toggle-primary" 
                                            checked={settings.compact_mode}
                                            onChange={(e) => setSettings(prev => ({ ...prev, compact_mode: e.target.checked }))}
                                        />
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Notifications</span>
                                        <input 
                                            type="checkbox" 
                                            className="toggle toggle-primary" 
                                            checked={settings.notifications}
                                            onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="card-actions justify-end">
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer les paramètres
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}