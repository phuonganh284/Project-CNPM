import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { getNotificationsByRole } from '../../data/mockNotifications';
import NotificationModal from './NotificationModal';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();

    // Đóng dropdown khi click bên ngoài
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

    // Load notifications theo role
    const userRole = user?.role || 'guest';

    useEffect(() => {
        // TODO: KHI CÓ BE - Thay bằng API call
        // const fetchNotifications = async () => {
        //     const res = await fetch(`/api/notifications?role=${userRole}`);
        //     const data = await res.json();
        //     setNotifications(data);
        // };
        // fetchNotifications();

        const data = getNotificationsByRole(userRole);
        setNotifications(data);
    }, [userRole]);

    // Đếm số notification chưa đọc
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Hàm xử lý khi bấm "View" một notification
    const handleViewNotification = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
        setIsOpen(false);

        // Tự động đánh dấu đã đọc khi mở modal
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }
    };

    // Hàm đánh dấu notification đã đọc
    const handleMarkAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        // TODO: KHI CÓ BE - Gọi API đánh dấu đã đọc
        // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
    };

    // Hàm xử lý khi bấm "View all notifications"
    const handleViewAll = () => {
        // Đánh dấu tất cả là đã đọc
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setIsOpen(false);
        // TODO: KHI CÓ BE - Navigate đến trang /notifications hoặc gọi API mark all read
        // navigate('/notifications');
        // hoặc: await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    };

    return (
        <div className="relative z-[60]" ref={dropdownRef}>
            {/* Notification Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
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
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`
                                    px-5 py-4 
                                    border-b border-gray-100
                                    hover:bg-gray-50

                                    transition-colors
                                    flex
                                    gap-3
                                    ${!notif.isRead ? 'bg-blue-50/30' : ''}
                                `}
                            >
                                {/* Dot indicator */}
                                <div className="flex-shrink-0 mt-1 flex flex-col items-center gap-2">
                                    <div className={`
                                        w-2 h-2 rounded-full
                                        ${notif.type === 'urgent' ? 'bg-red-500' : ''}
                                        ${notif.type === 'warning' ? 'bg-orange-500' : ''}
                                        ${notif.type === 'info' ? 'bg-blue-500' : ''}
                                    `} />
                                    {/* Unread indicator */}
                                    {!notif.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-inter text-sm mb-1 ${!notif.isRead ? 'text-[#4D4D4D] font-semibold' : 'text-gray-600 font-medium'}`}>
                                        {notif.title}
                                    </p>
                                    {notif.description && (
                                        <p className="text-gray-500 font-inter text-xs mb-2 line-clamp-1">
                                            {notif.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 font-inter text-xs">
                                            •{notif.time}
                                        </span>
                                        <button
                                            onClick={() => handleViewNotification(notif)}
                                            className="text-[#4A90E2] font-inter text-xs font-medium hover:underline cursor-pointer"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-gray-200 text-center">
                        <button
                            onClick={handleViewAll}
                            className="text-[#4A90E2] font-inter text-sm font-medium hover:underline cursor-pointer"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            <NotificationModal
                notification={selectedNotification}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onMarkAsRead={handleMarkAsRead}
            />
        </div>
    );
};

export default NotificationDropdown;
