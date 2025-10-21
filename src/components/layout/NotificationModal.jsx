import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationModal = ({ notification, isOpen, onClose, onMarkAsRead }) => {
    const navigate = useNavigate();

    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !notification) return null;

    const getTypeStyles = (type) => {
        switch (type) {
            case 'NEW_BORROW_REQUEST':
            case 'CHARGE_ISSUED':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: 'bg-red-500',
                    text: 'text-red-700',
                };
            case 'OVERDUE':
            case 'DUE_SOON':
                return {
                    bg: 'bg-orange-50',
                    border: 'border-orange-200',
                    icon: 'bg-orange-500',
                    text: 'text-orange-700',
                };
            case 'REQUEST_APPROVED':
            case 'REQUEST_REJECTED':
            case 'NEW_RETURN_REQUEST':
            case 'SYSTEM_ALERT':
            default:
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: 'bg-blue-500',
                    text: 'text-blue-700',
                };
        }
    };

    const styles = getTypeStyles(notification.type);
    const payload = notification.payload || {};

    // Render nội dung theo từng loại notification
    const renderContent = () => {
        switch (notification.type) {
            case 'CHARGE_ISSUED':
                return (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700 font-inter text-sm font-semibold mb-2">
                                Payment Required
                            </p>
                            <p className="text-gray-700 font-inter text-sm">
                                Please pay at the library counter before picking up your next book.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-gray-600 font-inter text-sm"><strong>Book:</strong> {payload.bookTitle}</p>
                            <p className="text-gray-600 font-inter text-sm"><strong>Charge ID:</strong> {payload.chargeId}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-700 font-inter text-sm font-semibold mb-3">Breakdown:</p>
                            {payload.lines?.map((line, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600 font-inter text-sm">{line.label}</span>
                                    <span className="text-gray-800 font-inter text-sm font-medium">{line.subtotal.toLocaleString()} đ</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-3">
                                <span className="text-gray-800 font-inter text-base font-bold">Total:</span>
                                <span className="text-red-600 font-inter text-lg font-bold">{payload.amount_total?.toLocaleString()} đ</span>
                            </div>
                        </div>
                    </div>
                );

            case 'REQUEST_APPROVED':
                return (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-green-700 font-inter text-sm font-semibold mb-2">
                                ✓ Your request has been approved!
                            </p>
                            <p className="text-gray-700 font-inter text-sm">
                                Please pick up the book by <strong>{payload.pickup_date}</strong> before 20:00, or it will expire.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-gray-600 font-inter text-sm"><strong>Book:</strong> {payload.bookTitle}</p>
                            <p className="text-gray-600 font-inter text-sm"><strong>Author:</strong> {payload.bookAuthor}</p>
                            <p className="text-gray-600 font-inter text-sm"><strong>Pickup Date:</strong> {payload.pickup_date}</p>
                        </div>
                    </div>
                );

            case 'REQUEST_REJECTED':
                return (
                    <div className="space-y-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <p className="text-orange-700 font-inter text-sm font-semibold mb-2">
                                Request Rejected
                            </p>
                            <p className="text-gray-700 font-inter text-sm">
                                Your borrow request for "{payload.bookTitle}" was rejected.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-gray-700 font-inter text-sm font-semibold">Reason:</p>
                            <p className="text-gray-600 font-inter text-sm bg-gray-50 p-3 rounded-lg">
                                {payload.reject_reason}
                            </p>
                        </div>
                    </div>
                );

            case 'DUE_SOON':
                return (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-yellow-700 font-inter text-sm font-semibold mb-2">
                                ⏰ Book due in 3 days
                            </p>
                            <p className="text-gray-700 font-inter text-sm">
                                Please return or renew "{payload.bookTitle}" before {payload.due_date}.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-gray-600 font-inter text-sm"><strong>Due Date:</strong> {payload.due_date}</p>
                            {payload.canRenew && (
                                <p className="text-gray-600 font-inter text-sm">
                                    <strong>Renewals:</strong> {payload.renew_count} / {payload.max_renews}
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'OVERDUE':
                return (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700 font-inter text-sm font-semibold mb-2">
                                ⚠️ Book Overdue
                            </p>
                            <p className="text-gray-700 font-inter text-sm">
                                "{payload.bookTitle}" is {payload.days_overdue} days overdue. Late fees apply.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-gray-600 font-inter text-sm"><strong>Due Date:</strong> {payload.due_date}</p>
                            <p className="text-gray-600 font-inter text-sm"><strong>Days Overdue:</strong> {payload.days_overdue}</p>
                            {payload.total_late_fee && (
                                <p className="text-red-600 font-inter text-sm font-semibold">
                                    <strong>Late Fee:</strong> {payload.total_late_fee.toLocaleString()} đ
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'NEW_BORROW_REQUEST':
                return (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">User:</span>
                                <span className="text-gray-800 font-inter text-sm font-medium">{payload.userName} ({payload.userId})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">Email:</span>
                                <span className="text-gray-800 font-inter text-sm">{payload.userEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">Book:</span>
                                <span className="text-gray-800 font-inter text-sm font-medium">{payload.bookTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">Pickup Date:</span>
                                <span className="text-gray-800 font-inter text-sm font-medium">{payload.pickup_date}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <p className="text-gray-600 font-inter text-sm">
                                Please review this request in the <strong>Borrow Requests</strong> page to approve or reject.
                            </p>
                        </div>
                    </div>
                );

            case 'NEW_RETURN_REQUEST':
                return (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">User:</span>
                                <span className="text-gray-800 font-inter text-sm font-medium">{payload.userName} ({payload.userId})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">Book:</span>
                                <span className="text-gray-800 font-inter text-sm font-medium">{payload.bookTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">Borrowed:</span>
                                <span className="text-gray-800 font-inter text-sm">{payload.borrowed_at}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-inter text-sm">Due Date:</span>
                                <span className="text-gray-800 font-inter text-sm">{payload.due_date}</span>
                            </div>
                            {payload.days_overdue > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-red-600 font-inter text-sm font-semibold">Days Overdue:</span>
                                    <span className="text-red-600 font-inter text-sm font-semibold">{payload.days_overdue}</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <p className="text-gray-600 font-inter text-sm">
                                Please go to <strong>Return Requests</strong> page to assess the book condition and process the return.
                            </p>
                        </div>
                    </div>
                );

            case 'SYSTEM_ALERT':
                return (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <p className="text-gray-600 font-inter text-sm"><strong>Book:</strong> {payload.bookTitle}</p>
                            <p className="text-gray-600 font-inter text-sm"><strong>Available:</strong> {payload.available_count} copies</p>
                            <p className="text-gray-600 font-inter text-sm"><strong>Borrowed:</strong> {payload.borrowed_count} copies</p>
                            <p className="text-gray-600 font-inter text-sm"><strong>Pending Requests:</strong> {payload.pending_requests}</p>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <p className="text-orange-700 font-inter text-sm font-semibold mb-2">Recommendation:</p>
                            <p className="text-gray-700 font-inter text-sm">
                                {payload.recommendation}
                            </p>
                        </div>
                    </div>
                );

            default:
                return (
                    <p className="text-gray-700 font-inter text-[15px] leading-relaxed whitespace-pre-line">
                        {notification.fullContent || notification.description}
                    </p>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-[600px] max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className={`${styles.bg} ${styles.border} border-b px-6 py-4 flex items-start justify-between`}>
                    <div className="flex items-start gap-4 flex-1">
                        {/* Type indicator */}
                        <div className={`${styles.icon} w-3 h-3 rounded-full mt-2 flex-shrink-0`} />
                        
                        <div className="flex-1">
                            <h2 className={`${styles.text} font-inter text-lg font-semibold mb-1`}>
                                {notification.title}
                            </h2>
                            <p className="text-gray-500 text-sm font-inter">
                                {notification.time} ago
                            </p>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L5 15M5 5L15 15" stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(80vh-200px)]">
                    {renderContent()}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-inter text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    
                    {/* Nút Go to page cho librarian notifications */}
                    {(notification.type === 'NEW_BORROW_REQUEST' || notification.type === 'NEW_RETURN_REQUEST') && (
                        <button
                            onClick={() => {
                                onMarkAsRead(notification.id);
                                onClose();
                                const targetPage = notification.type === 'NEW_BORROW_REQUEST' 
                                    ? '/borrow-requests' 
                                    : '/return-requests';
                                navigate(targetPage);
                            }}
                            className="px-5 py-2.5 rounded-full bg-[#4A90E2] text-white font-inter text-sm font-medium hover:bg-[#357ABD] transition-colors"
                        >
                            Go to {notification.type === 'NEW_BORROW_REQUEST' ? 'Borrow Requests' : 'Return Requests'}
                        </button>
                    )}
                    
                    {/* Nút Mark as Read cho các notification khác */}
                    {!notification.isRead && notification.type !== 'NEW_BORROW_REQUEST' && notification.type !== 'NEW_RETURN_REQUEST' && (
                        <button
                            onClick={() => {
                                onMarkAsRead(notification.id);
                                onClose();
                            }}
                            className="px-5 py-2.5 rounded-full bg-[#4A90E2] text-white font-inter text-sm font-medium hover:bg-[#357ABD] transition-colors"
                        >
                            Mark as Read
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
