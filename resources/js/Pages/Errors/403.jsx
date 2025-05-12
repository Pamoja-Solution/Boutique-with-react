import { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function ForbiddenModal({ showModal = false, errorMessage = 'Cette action n\'est pas autorisée.' }) {
    const handleClose = () => {
        router.visit('/dashboard');
    };

    return (
        <dialog className={`modal ${showModal ? 'modal-open' : ''}`}>
            <Head  title="Erreur" />
            
            <div className="modal-box text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h3 className="font-bold text-2xl text-red-600">403 - Accès refusé</h3>
                <p className="py-4">{errorMessage}</p>

                <div className="modal-action justify-center">
                    <button onClick={handleClose} className="btn btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        </dialog>
    );
}
