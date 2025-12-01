import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';
import NotificationModal from './NotificationModal';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const result = await notificationService.getNotifications();
            if (result && result.data) {
                setNotifications(result.data);
            }
            setError(null);
        } catch (err) {
            console.error("API Error:", err);
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching notifications. Please try again.';
            setError(errorMessage);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Effect to close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Effect to fetch notifications on user change
    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Handler for clicking on a single notification
    const handleNotificationClick = (notification) => {
        // Close dropdown first
        setIsOpen(false);
        
        // Open the detail modal
        setSelectedNotification(notification);
        setIsModalOpen(true);

        // Mark as read if it's unread and has a valid ID
        if (!notification.isRead && notification.notificationId) {
            handleMarkAsRead(notification.notificationId);
        }
    };

    // API call to mark a single notification as read
    const handleMarkAsRead = async (notificationId) => {
        try {
            // Call the service, which now returns the full updated list of notifications
            const result = await notificationService.markAsViewed(notificationId);
            if (result && result.data) {
                setNotifications(result.data);
            }
        } catch (err) {
            console.error("Failed to mark as read:", err);
            // Re-fetch to ensure UI is in sync with backend on error
            fetchNotifications();
        }
    };

    // Handler for the "Mark all as read" button
    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            // Call the service, which now returns the full updated list of notifications
            const result = await notificationService.markAllAsRead();
            if (result && result.data) {
                setNotifications(result.data);
            }
        } catch (err) {
            console.error("Failed to mark all as read:", err);
            // Re-fetch to ensure UI is in sync with backend on error
            fetchNotifications();
        }
    };

    // Simplified dropdown toggle
    const handleToggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications(); // Fetch fresh data when opening
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative z-[70]" ref={dropdownRef}>
            {/* Notification Button */}
            <button
                onClick={handleToggleDropdown}
                className="
                    flex 
                    items-center 
                    justify-center
                    gap-3
                    w-[190px] 
                    h-[47px]
                    bg-white 
                    rounded-full
                    shadow-sm
                    hover:bg-gray-50
                    transition-all
                    duration-200
                    relative
                    cursor-pointer
                "
            >
                <img
                    src={assets.bell}
                    alt="Notification"
                    className="w-7 h-7  ml-2"
                />
                <span className="text-[#4D4D4D] font-inter text-[15px] font-medium">
                    Notification
                </span>

                {/* Badge số lượng notification chưa đọc */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 left-8 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu - Canh trục đối xứng với nút */}
            {isOpen && (
                <div className="
                    absolute 
                    top-[55px] 
                    left-1/2
                    -translate-x-1/2
                    w-[380px]
                    bg-white 
                    rounded-2xl 
                    shadow-xl
                    border border-gray-200
                    overflow-hidden
                    z-50
                    animate-in fade-in slide-in-from-top-2 duration-200
                ">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h3 className="text-[#4D4D4D] font-inter text-base font-semibold">
                            Notifications
                        </h3>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : error ? (
                            <p className="p-4 text-center text-red-500 text-sm">{error}</p>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No new notifications.</div>
                        ) : (
                            notifications.map((notif, index) => (
                                <div
                                    key={notif.notificationId || index}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`
                                        px-5 py-4 
                                        border-b border-gray-100
                                        hover:bg-gray-50
                                        transition-colors
                                        flex
                                        gap-3
                                        cursor-pointer
                                        ${!notif.isRead ? 'bg-blue-50/30' : ''}
                                    `}
                                >
                                    {/* Dot indicator */}
                                    <div className="flex-shrink-0 mt-1">
                                        {!notif.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-inter text-sm mb-1 ${!notif.isRead ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>
                                            {notif.content}
                                        </p>
                                        <span className="text-gray-400 font-inter text-xs">
                                            {notif.timeAgo} ago
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-gray-200 text-center bg-gray-50">
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-[#4A90E2] font-inter text-sm font-medium hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={unreadCount === 0}
                        >
                            Mark all as read
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            <NotificationModal
                notification={selectedNotification}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default NotificationDropdown;
