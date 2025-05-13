import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(route('notifications.latest'));
            setNotifications(data.notifications);
            
            const countResponse = await axios.get(route('notifications.count'));
            setUnreadCount(countResponse.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Rafraîchir les notifications toutes les 30 secondes
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.post(route('notifications.read', id));
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const renderNotificationItem = (notification) => {
        return (
            <Link key={notification.id} href={route('notifications.index')}>
            <div 
                
                className={`flex gap-3 p-2 hover:bg-base-200 rounded-lg ${notification.is_read ? 'opacity-70' : ''}`}
                onClick={() => markAsRead(notification.id)}
            >
                <div className="avatar placeholder">
                    <div className={notification.color_class + " w-8 h-8 rounded-full"}>
                        <span dangerouslySetInnerHTML={{ __html: notification.icon_html }} />
                    </div>
                </div>
                <div>
                    <p className="text-sm">{notification.message}</p>
                    Voir

                    <p className="text-xs opacity-70">{notification.time_ago}</p>
                </div>
            </div>
            </Link>
        );
    };

    return (
        <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-sm btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="badge badge-xs badge-primary indicator-item">{unreadCount}</span>
                    )}
                </div>
            </button>
            <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72 z-10">
                <div className="p-2">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    <div className="divider my-1"></div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <span className="loading loading-spinner text-primary"></span>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map(renderNotificationItem)
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                Aucune notification
                            </div>
                        )}
                    </div>
                    
                    <div className="divider my-1"></div>
                    <div className="flex gap-2">
                        <Link href={route('notifications.index')} className="btn btn-sm btn-ghost flex-1">
                            Tout voir
                        </Link>
                        <Link href={route('notifications.read-all')} method="post" as="button" className="btn btn-sm btn-ghost flex-1">
                            Tout marquer lu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}