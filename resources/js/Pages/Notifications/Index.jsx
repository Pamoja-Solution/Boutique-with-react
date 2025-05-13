import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

// Fonctions helper définies avant le composant
function getNotificationCardClass(type) {
    const classes = {
        'stock_alerte': 'bg-error/10 border-error/20',
        'vente': 'bg-success/10 border-success/20',
        'user_login': 'bg-info/10 border-info/20',
        'new_user': 'bg-warning/10 border-warning/20',
    };
    return classes[type] || 'bg-base-200 border-base-300';
}
function getNotificationIconClass(type) {
    const classes = {
        'stock_alerte': 'bg-error text-error-content',
        'vente': 'bg-success text-success-content',
        'user_login': 'bg-info text-info-content',
        'new_user': 'bg-warning text-warning-content',
    };
    return classes[type] || 'bg-primary text-primary-content';
}

function getNotificationAction(notification) {
    switch (notification.type) {
        case 'stock_alerte':
            return (
                <Link href={`/produits/${notification.data.produit_id}`} className="btn btn-outline btn-error btn-sm">
                    Voir le produit
                </Link>
            );
        case 'vente':
            return (
                <a
                href={`/ventes/${notification.data.vente_id}/ticket`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-success btn-sm"
              >
                Voir la vente
              </a>
              
            );
        case 'user_login':
        case 'new_user':
            return (
                <Link href={`/users/${notification.data.user_id}/edit`} className="btn btn-outline btn-info btn-sm">
                    Voir l'utilisateur 
                </Link>
            );
        default:
            return null;
    }
}

export default function NotificationsIndex({ notifications }) {

    const getIconHtml = (type) => {
        const icons = {
            'stock_alerte': '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>',
            'vente': '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>',
            'user_login': '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>',
            'new_user': '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>'
        };

        return icons[type] || '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>';
    };
    
    const getColorClass = (color) => {
        const colors = {
            'red': 'bg-red-100 text-red-600',
            'green': 'bg-green-100 text-green-600',
            'blue': 'bg-blue-100 text-blue-600',
            'yellow': 'bg-yellow-100 text-yellow-600',
        };

        return colors[color] || 'bg-blue-100 text-blue-600';
    };

    return (
        <AppLayout>
            <Head title="Notifications" />
        
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-base-100 rounded-box shadow-lg p-6">
                        {/* En-tête */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-primary">Mes Notifications</h1>
                            <Link 
                                href={route('notifications.read-all')} 
                                method="post" 
                                as="button" 
                                className="btn btn-primary btn-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Tout marquer comme lu
                            </Link>
                        </div>
        
                        {/* Liste des notifications */}
                        <div className="space-y-3">
                            {notifications.data.length > 0 ? (
                                notifications.data.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        className={`card card-compact border transition-all duration-200 ${notification.read_at ? 'opacity-70' : 'shadow-md'} ${getNotificationCardClass(notification.type)}`}
                                    >
                                        <div className="card-body">
                                            <div className="flex items-start gap-4">
                                                {/* Icône */}
                                                <div className={`flex-shrink-0 ${getNotificationIconClass(notification.type)} rounded-full p-3`}>
                                                    <span className="text-xl" dangerouslySetInnerHTML={{ __html: getIconHtml(notification.type) }} />
                                                </div>
                                                
                                                {/* Contenu */}
                                                <div className="flex-1">
                                                    <h3 className="card-title text-lg">{notification.data.message}</h3>
                                                    <div className="text-sm text-gray-500 mb-2">
                                                        {new Date(notification.created_at).toLocaleString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                    
                                                    {/* Actions spécifiques */}
                                                    <div className="card-actions justify-end">
                                                        {getNotificationAction(notification)}
                                                    </div>
                                                </div>
                                                
                                                {/* Bouton marquer comme lu */}
                                                {!notification.read_at && (
                                                    <div className="flex-shrink-0 ">
                                                        
                                                        <Link 
                                                            href={route('notifications.read', notification.id)} 
                                                            method="post" 
                                                            as="button" 
                                                            className="btn  btn-accent"
                                                            title="Marquer comme lu"
                                                        >
                                                            
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            Marquer comme lu
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">Aucune notification disponible</p>
                                </div>
                            )}
                        </div>
        
                        {/* Pagination */}
                        {notifications.data.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination 
                                    links={notifications.links} 
                                    className="join" 
                                    activeClassName="btn-active"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


