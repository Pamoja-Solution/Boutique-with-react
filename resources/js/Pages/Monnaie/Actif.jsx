import axios from 'axios';
import { useState, useEffect } from 'react';

export default function MonnaieActif() {
    const [systeme, setSysteme] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(route('currencies.get'));

                if (response?.data?.systeme) {
                    setSysteme(response.data.systeme);
                } else {
                    //console.warn('Réponse vide ou invalide', response);
                }
            } catch (error) {
                //console.error('Erreur lors de la récupération de la monnaie :', error);
            }
        };

        fetchData();
    }, []);

    if (!systeme) return <p>Aucune devise</p>;

    return (
        <div className="flex gap-2 items-center flex-wrap">
            {/* NOUVEAU: Information sur la devise */}
            <div className="badge badge-ghost gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" clipRule="evenodd" />
                </svg>
                {systeme.symbole} • {systeme.code} (1$ = {systeme.taux_achat} {systeme.symbole})
            </div>

            {/* NOUVEAU: Statut du système */}
            <div className="badge badge-success gap-1">
                <span className="w-2 h-2 bg-current rounded-full"></span>
                Créé il y a : {systeme.created_at}
            </div>
        </div>
    );
}
