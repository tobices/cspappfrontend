import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, CheckCheck, CheckCircle, DollarSign, Gift, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../services/api';

interface Notification {
    id: string;
    type: 'event' | 'donation' | 'birthday' | 'system';
    title: string;
    message: string;
    date: string;
    read: boolean;
    link?: string;
}

export const Notifications: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    // Load notifications from localStorage and fetch new ones
    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(notifications));
        }
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications, user?.id]);

    const loadNotifications = async () => {
        try {
            // Load saved notifications from localStorage
            const savedNotifications = localStorage.getItem(`notifications_${user?.id}`);
            let existingNotifications: Notification[] = savedNotifications ? JSON.parse(savedNotifications) : [];

            // Fetch upcoming events as new notifications
            const eventsResponse = await eventAPI.getAllEvents({ upcoming: 'true', limit: 10 });
            const events = eventsResponse.data.data.events;

            // Create notification IDs based on event IDs to avoid duplicates
            const eventNotifications: Notification[] = events.map((event: any) => ({
                id: `event-${event.id}`,
                type: 'event',
                title: 'Upcoming Event',
                message: `${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.time}`,
                date: event.date,
                read: false,
                link: '/events'
            }));

            // Merge existing notifications with new ones, preserving read status
            const mergedNotifications = [...eventNotifications];

            // Update read status for existing notifications
            for (const existing of existingNotifications) {
                const foundIndex = mergedNotifications.findIndex(n => n.id === existing.id);
                if (foundIndex !== -1) {
                    // Preserve read status
                    mergedNotifications[foundIndex].read = existing.read;
                } else if (existing.read === false) {
                    // Keep unread notifications that are no longer in the new list (e.g., past events)
                    // but only if they are not too old (within 7 days)
                    const existingDate = new Date(existing.date);
                    const daysOld = (Date.now() - existingDate.getTime()) / (1000 * 60 * 60 * 24);
                    if (daysOld < 7) {
                        mergedNotifications.push(existing);
                    }
                }
            }

            // Sort by date (newest first)
            mergedNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setNotifications(mergedNotifications);

        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        toast.success('All notifications marked as read');
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            window.location.href = notification.link;
        }
        setIsOpen(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'event':
                return <Calendar className="w-4 h-4 text-blue-500" />;
            case 'donation':
                return <DollarSign className="w-4 h-4 text-green-500" />;
            case 'birthday':
                return <Gift className="w-4 h-4 text-purple-500" />;
            default:
                return <CheckCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            <div className="flex gap-2">
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-3 h-3" />
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 ${!notification.read
                                                ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-900">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        // You can add a "View All" page here
                                    }}
                                    className="text-xs text-primary-600 hover:text-primary-700"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};