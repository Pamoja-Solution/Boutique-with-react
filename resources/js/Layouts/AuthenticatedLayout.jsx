import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import DevisesForm from '@/Components/LesForms/Devise';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import MonnaieActif from '@/Pages/Monnaie/Actif';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DaisyToast from '@/Components/DaisyToast';
import CaisseStatus from '@/Components/CaisseStatus';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
        const [notificationsOpen, setNotificationsOpen] = useState(false);
        return (
            <>
            <Toaster position="top-right" />
                <div className="flex h-screen bg-base-100">
    
        {/* Sidebar - Navigation principale */}
        <div className="hidden md:flex flex-col w-64 bg-base-200 shadow-lg border-r border-base-300">
            {/* Logo et entête */}
            <div className="p-4 flex items-center gap-3 border-b border-base-300">
                <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-content" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">NexusShop</h1>
                    <p className="text-xs opacity-70">Gestion de boutique</p>
                </div>
            </div>
    
            {/* Menu principal */}
            <nav className="flex-1 overflow-y-auto p-2">
                <ul className="menu menu-md p-0 gap-1">
                    <li className="menu-title my-2 text-sm">Principal</li>
                    
                    <li>
                        <Link href={route('dashboard')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Tableau de bord
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Point de vente */}
                    {user.role=="admin" &&(
                        <li>
                        <Link href={route('userStats')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                            </svg>
                            Les Ventes
                        </Link>
                    </li>
                    )}
                    <li>
                        <Link href={route('pos.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                            </svg>
                            Point de vente
                        </Link>
                    </li>
    
                    <li className="menu-title my-2 text-sm">Gestion produits</li>
                    
                    <li>
                        <Link href={route('produits.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                            Produits
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Catégories */}
                    <li>
                        <Link href={route('categories.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            Catégories
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Stocks */}
                    <li>
                        <Link href={route('stocks.indexs')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17A3 3 0 015 5zm4.244 6.898l-1.5-1.5 4.243-4.242 1.5 1.5-4.243 4.242zM9.3 14.3a1 1 0 10-1.4 1.4l1.3 1.3a1 1 0 001.5 0l5.3-5.3a1 1 0 00-1.4-1.4l-5.3 5.3z" clipRule="evenodd" />
                            </svg>
                            Gestion des stocks
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Inventaires */}
                    <li>
                        <Link href={route('inventaires.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            Inventaires
                        </Link>
                    </li>
    
                    <li className="menu-title my-2 text-sm">Ventes & Clients</li>
                    
                    <li>
                        <Link href={route('ventes.stats')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            Ventes
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Clients */}
                    <li>
                        <Link href={route('clients.stats')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            Clients
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Programme de fidélité 
                    <li>
                        <Link href={route('loyalty.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Programme fidélité
                        </Link>
                    </li>*/}
                    
                    {/* NOUVEAU: Promotions 
                    <li>
                        <Link href={route('promotions.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                            </svg>
                            Promotions
                        </Link>
                    </li>*/}
    
                    <li className="menu-title my-2 text-sm">Finance</li>
                    
                    {/* NOUVEAU: Caisse */}
                    <li>
                        <Link href={route('caisses.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Caisses
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Dépenses */}
                    <li>
                        <Link href={route('depenses.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                            </svg>
                            Dépenses
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Devises */}
                    <li>
                        <Link href={route('currencies.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" clipRule="evenodd" />
                            </svg>
                            Devises
                        </Link>
                    </li>
    
                    <li className="menu-title my-2 text-sm">Rapports & Administration</li>
                    
                    <li>
                        <Link href={route('reports.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            Rapports
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Utilisateurs */}
                    <li>
                        <Link href={route('users.index')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            Utilisateurs
                        </Link>
                    </li>
                    
                    {/* NOUVEAU: Paramètres */}
                    <li>
                        <Link href={route('user-settings.edit')} className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Paramètres
                        </Link>
                    </li>
                </ul>
            </nav>
            
                {/* NOUVEAU: Section d'aide et statut */}
                <div className="p-4 border-t border-base-300">
                    <div className="flex items-center justify-between mb-2">
                        <div className="badge badge-success gap-1">
                            <span className="w-2 h-2 bg-success rounded-full"></span>
                            Connecté
                        </div>
                        <div className="text-xs opacity-70">v2.5.0</div>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-xs btn-ghost">Aide</button>
                        <button className="btn btn-xs btn-ghost">Support</button>
                    </div>
                </div>
        
        
        
        
                {/* Menu Mobile - Seulement visible sur petits écrans */}
                {mobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 z-500">
                            <div 
                                className="fixed inset-0 bg-black bg-opacity-50" 
                                onClick={() => setMobileMenuOpen(false)}
                            ></div>
                            <div className="relative w-80 h-full bg-base-200 shadow-lg">
                                {/* Copiez ici le contenu de votre sidebar */}
                                <div className="p-4 flex items-center gap-3 border-b border-base-300">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                            {/* Icône */}
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">NexusShop</h1>
                                    </div>
                                </div>
                                
                                <nav className="overflow-y-auto p-2">
                                    <ul className="menu menu-md p-0 gap-1">
                                        {/* Répétez vos éléments de menu ici */}
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At nam vero fugiat officia quo! Modi eveniet aspernatur beatae omnis! Hic eos ipsa id consectetur mollitia totam, temporibus odio dignissimos fugit.</p>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
    
    
    
        </div>
    
    
    
            
                {/* Menu Mobile - Version complète */}
                <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                    
                    {/* Menu content - Largeur adaptative */}
                    <div className={`absolute left-0 top-0 h-full bg-base-200 shadow-xl transform ${
                        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ${
                        // Adaptation de la largeur en fonction de la taille de l'écran
                        'w-full max-w-xs sm:max-w-sm' // xs: 100% (jusqu'à 320px), sm: 384px max
                    }`}>
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b border-base-300">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-content" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">NexusShop</h1>
                                    <p className="text-xs opacity-70">Gestion de boutique</p>
                                </div>
                            </div>
                            <button 
                                className="btn btn-ghost btn-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
            
                        {/* Menu items - Contenu scrollable */}
                        <nav className="h-[calc(100%-180px)] overflow-y-auto p-2">
                            <ul className="menu menu-md p-0 gap-1">
                                <li className="menu-title my-2 text-sm">Principal</li>
                                
                                <li>
                                    <Link href={route('dashboard')} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        Tableau de bord
                                    </Link>
                                </li>
                                
                                {/* Point de vente */}
                                <li>
                                    <Link href={route('pos.index')} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                        </svg>
                                        Point de vente
                                    </Link>
                                </li>

                                {user.role=="admin" &&(
                                    <li>
                                    <Link href={route('userStats')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                        </svg>
                                        Les Ventes
                                    </Link>
                                </li>
                                )}
            
                                <li className="menu-title my-2 text-sm">Gestion produits</li>
                                
                                <li>
                                    <Link href={route('produits.index')} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                        </svg>
                                        Produits
                                    </Link>
                                </li>
                                
                                {/* Catégories */}
                                <li>
                                    <Link href={route('categories.index')} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                        </svg>
                                        Catégories
                                    </Link>
                                </li>
                                
                                {/* Stocks */}
                                <li>
                                    <Link href={route('stocks.indexs')} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17A3 3 0 015 5zm4.244 6.898l-1.5-1.5 4.243-4.242 1.5 1.5-4.243 4.242zM9.3 14.3a1 1 0 10-1.4 1.4l1.3 1.3a1 1 0 001.5 0l5.3-5.3a1 1 0 00-1.4-1.4l-5.3 5.3z" clipRule="evenodd" />
                                        </svg>
                                        Gestion des stocks
                                    </Link>
                                </li>
                                
                                {/* Inventaires */}
                                <li>
                                    <Link href={route('inventaires.index')} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                        Inventaires
                                    </Link>
                                </li>
            
                                <li className="menu-title my-2 text-sm">Ventes & Clients</li>
                                
                                <li>
                                    <Link href={route('ventes.stats')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                        Ventes
                                    </Link>
                                </li>
                                
                                {/* NOUVEAU: Clients */}
                                <li>
                                    <Link href={route('clients.stats')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                        </svg>
                                        Clients
                                    </Link>
                                </li>
                                
                                {/* NOUVEAU: Programme de fidélité *
                                <li>
                                    <Link href={route('loyalty.index')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        Programme fidélité
                                    </Link>
                                </li>*/}
                                
                                {/* NOUVEAU: Promotions 
                                <li>
                                    <Link href={route('promotions.index')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                                        </svg>
                                        Promotions
                                    </Link>
                                </li>*/}
            
                                <li className="menu-title my-2 text-sm">Finance</li>
                                
                                {/* NOUVEAU: Caisse */}
                                <li>
                                    <Link href={route('caisses.index')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Caisses
                                    </Link>
                                </li>
                                
                                {/* NOUVEAU: Dépenses */}
                                <li>
                                    <Link href={route('depenses.index')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                                        </svg>
                                        Dépenses
                                    </Link>
                                </li>
                                
                                {/* NOUVEAU: Devises */}
                                <li>
                                    <Link href={route('currencies.index')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" clipRule="evenodd" />
                                        </svg>
                                        Devises
                                    </Link>
                                </li>
            
                                <li className="menu-title my-2 text-sm">Rapports & Administration</li>
                                
                                <li>
                                    <Link href={route('reports.index')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                        </svg>
                                        Rapports
                                    </Link>
                                </li>
                                
                                {/* NOUVEAU: Utilisateurs */}
                                <li>
                                    <Link href={route('users.index')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                        Utilisateurs
                                    </Link>
                                </li>
                                
                                {/* NOUVEAU: Paramètres */}
                                <li>
                                    <Link href={route('user-settings.edit')} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        Paramètres
                                    </Link>
                                </li>
                            </ul>
                        </nav>
            
                        {/* Footer */}
                        <div className="absolute bottom-0 w-full p-4 border-t border-base-300">
                            <div className="flex items-center justify-between mb-2">
                                <div className="badge badge-success gap-1">
                                    <span className="w-2 h-2 bg-success rounded-full"></span>
                                    Connecté
                                </div>
                                <div className="text-xs opacity-70">v2.5.0</div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-xs btn-ghost">Aide</button>
                                <button className="btn btn-xs btn-ghost">Support</button>
                            </div>
                        </div>
                    </div>
                </div>
            {/* Contenu principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar en haut */}
                <div className="bg-base-100 border-b border-base-300 p-2 shadow-sm">
                    <div className="flex items-center justify-between">
                        {/* Bouton menu mobile et titre de page */}
                        <div className="flex items-center gap-3">
                        <label htmlFor="drawer-toggle" className="btn btn-sm btn-ghost md:hidden drawer-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </label>
                            <h1 className="text-lg font-semibold">Tableau de bord</h1>
                        </div>
    
                        {/* NOUVEAU: Actions rapides et utilitaires */}
                        <div className="flex items-center gap-2">
                            {/* Bouton nouvelle vente rapide */}
                            <div className="md:block hidden">
                                <Link href={route('point-de-vente')} className="btn btn-sm btn-primary gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Nouvelle vente
                                </Link>
                            </div>
                            
                            {/* Recherche */}
                            <div className="md:block hidden">
                                
                                <label className="input w-48">
                                    
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                        >
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                        </g>
                                    </svg>
                                    <input type="search" className='input' required placeholder="Rechercher..." />
                                    </label>
                            </div>
    
                            {/* NOUVEAU: Statut de la caisse */}
                            <CaisseStatus />

    
                            {/* Notifications */}
                            <div className="dropdown dropdown-end">
                                <button tabIndex={0} className="btn btn-sm btn-ghost btn-circle">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <span className="badge badge-xs badge-primary indicator-item">3</span>
                                    </div>
                                </button>
                                <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72 z-10">
                                    <div className="p-2">
                                        <h3 className="font-semibold mb-2">Notifications</h3>
                                        <div className="divider my-1"></div>
                                        
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            <div className="flex gap-3 p-2 hover:bg-base-200 rounded-lg">
                                                <div className="avatar placeholder">
                                                    <div className="bg-red-100 text-red-600 w-8 h-8 rounded-full">
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm">Stock faible: <span className="font-medium">Lait en poudre</span></p>
                                                    <p className="text-xs opacity-70">Il y a 5 minutes</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-3 p-2 hover:bg-base-200 rounded-lg">
                                                <div className="avatar placeholder">
                                                    <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full">
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm">Vente <span className="font-medium">#1234</span> effectuée</p>
                                                    <p className="text-xs opacity-70">Il y a 30 minutes</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-3 p-2 hover:bg-base-200 rounded-lg">
                                                <div className="avatar placeholder">
                                                    <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full">
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm">Nouveau client ajouté</p>
                                                    <p className="text-xs opacity-70">Aujourd'hui, 10:30</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="divider my-1"></div>
                                        <button className="btn btn-sm btn-ghost w-full">Voir toutes les notifications</button>
                                    </div>
                                </div>
                            </div>
    
                            {/* NOUVEAU: Menu Aide Rapide */}
                            <div className="dropdown dropdown-end hidden md:block">
                                <button tabIndex={0} className="btn btn-sm btn-ghost btn-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                                    <ul className="menu menu-sm p-0">
                                        <li><a>Guide utilisateur</a></li>
                                        <li><a>Vidéos tutoriels</a></li>
                                        <li><a>Contacter le support</a></li>
                                        <li><a>Raccourcis clavier</a></li>
                                    </ul>
                                </div>
                            </div>
    
                            {/* Menu profil */}
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-sm btn-ghost btn-circle avatar">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral text-neutral-content flex items-center justify-center">
                                    {user?.photo ? (
                                        <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm">
                                            
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'JD'}
                                        </span>
                                    )}
                                    </div>

                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                    <li className="menu-title pb-1">
                                        <div className="flex flex-col bg-base-100 hover:bg-base-100">
                                            <span className="font-bold">{user.name}</span>
                                            <span className="text-sm opacity-90">{(user.role)}</span>
                                        </div>
                                    </li>
                                    <div className="divider my-1"></div>
                                    <li><Link href={route('profile.edit')}>Profil </Link></li>
                                    <li><Link href={route('user-settings.edit')}>Paramètres</Link></li>
                                    <div className="divider my-1"></div>
                                    <li><Link href={route('logout')} method="post" as="button">Déconnexion</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* NOUVEAU: Barre d'état et chemins de navigation */}
                <div className="bg-base-100 border-b border-base-300 px-4 py-2 flex flex-wrap items-center justify-between">
                    <div className="breadcrumbs text-sm mb-1">
                        <ul>
                            <li><Link href={route('dashboard')}>Accueil</Link></li>
                            <li>Tableau de bord</li>
                        </ul>
                    </div>
                    
                   <MonnaieActif/>
                </div>
    
                {/* NOUVEAU: Zone principale de contenu avec scroll */}
                <div className="flex-1 overflow-y-auto p-4 bg-base-200">
                    {/* AMÉLIORÉ: Tableau de bord avec tuiles */}
                    {children}
                    
                </div>
    
                {/* NOUVEAU: Footer avec informations système */}
                <footer className="bg-base-100 border-t border-base-300 p-2 text-xs text-center text-base-content">
                    <div className="flex justify-between items-center">
                        <span>© 2025 NexusShop - Système de gestion de boutique</span>
                        <span>Version 2.5.0 | Dernière mise à jour: 05/05/2025</span>
                    </div>
                </footer>
            </div>
            <DaisyToast />

        </div>
        </>
        );
    }
