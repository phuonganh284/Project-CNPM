import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper to format the notification title from the type_name
const formatTitle = (typeName) => {
    if (!typeName) return 'Notification';
    return typeName.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const NotificationModal = ({ notification, isOpen, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !notification) return null;

    const { metadata, type_name, content, time_ago } = notification;
    const title = formatTitle(type_name);

    // This function can be simplified or expanded based on design needs
    const getTypeStyles = (type) => {
        switch (type) {
            case 'NEW_BORROW_REQUEST':
            case 'PENALTY_ISSUED':
            case 'OVERDUE':
                return { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-500', text: 'text-red-700' };
            case 'BORROW_DUE_SOON':
                return { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-500', text: 'text-orange-700' };
            case 'REQUEST_APPROVED':
                return { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-500', text: 'text-green-700' };
            default:
                return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-500', text: 'text-blue-700' };
        }
    };

    const styles = getTypeStyles(type_name);

    const renderContent = () => {
        if (!metadata) {
            return <p className="text-gray-700">{content}</p>;
        }

        const DetailItem = ({ icon, label, value }) => (
            <div className="flex items-start text-sm">
                <div className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400">{icon}</div>
                <div className="flex-1">
                    <span className="font-semibold text-gray-800">{label}:</span>
                    <span className="ml-2 text-gray-600">{value}</span>
                </div>
            </div>
        );

        const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
        const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
        const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>;
        const FeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0H3m3.75 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0A.75.75 0 016 12h.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m0 0a.75.75 0 01.75-.75h.75M12 12h.008v.008H12V12zm0 0h.008v.008H12V12zm.75 0h.008v.008h-.008V12zm0 0h.008v.008h-.008V12z" /></svg>;
        const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


        switch (type_name) {
            case 'REQUEST_APPROVED':
                return (
                    <div className="space-y-3">
                        <p className="text-gray-800 bg-green-50 p-3 rounded-lg text-sm">{content}</p>
                        <div className="border-t pt-3 space-y-3">
                            <DetailItem icon={<BookIcon />} label="Book" value={metadata.book_title} />
                            <DetailItem icon={<InfoIcon />} label="Copy ID" value={`#${metadata.copy_id}`} />
                            <DetailItem icon={<CalendarIcon />} label="Pickup By" value={new Date(metadata.pickup_date).toLocaleDateString('en-GB')} />
                        </div>
                    </div>
                );
            
            case 'REQUEST_REJECTED':
                 return (
                    <div className="space-y-3">
                        <p className="text-gray-800">Your borrow request for "{metadata.book_title}" was rejected.</p>
                        <div className="border-t pt-3 space-y-2">
                            <DetailItem icon={<BookIcon />} label="Book" value={metadata.book_title} />
                            <DetailItem icon={<InfoIcon />} label="Copy ID" value={`#${metadata.copy_id}`} />
                            <p className="font-semibold text-gray-800 text-sm mt-2">Reason:</p>
                            <p className="bg-gray-100 p-3 rounded-lg text-gray-600 text-sm">{metadata.rejection_reason || 'No reason provided.'}</p>
                        </div>
                    </div>
                );

            case 'PENALTY_ISSUED':
                return (
                    <div className="space-y-3">
                        <p className="text-gray-800 bg-yellow-50 p-3 rounded-lg text-sm">{content}</p>
                        <div className="border-t pt-3 space-y-3">
                            <DetailItem icon={<BookIcon />} label="Book" value={metadata.book_title} />
                            <DetailItem icon={<InfoIcon />} label="Copy ID" value={`#${metadata.copy_id}`} />
                            <DetailItem icon={<InfoIcon />} label="Assessed" value={metadata.assessed_condition} />
                            {metadata.damage_fee > 0 && <DetailItem icon={<FeeIcon />} label="Damage Fee" value={`${metadata.damage_fee.toLocaleString()} đ`} />}
                            {metadata.overdue_fee > 0 && <DetailItem icon={<FeeIcon />} label="Overdue Fee" value={`${metadata.overdue_fee.toLocaleString()} đ`} />}
                            <div className="!mt-4 pt-3 border-t">
                                <DetailItem icon={<FeeIcon />} label="Total Fee" value={<span className="font-bold text-red-600">{metadata.total_fee.toLocaleString()} đ</span>} />
                            </div>
                        </div>
                    </div>
                );

            case 'BORROW_DUE_SOON':
                return (
                    <div className="space-y-3">
                        <p className="text-gray-800">{content}</p>
                        <div className="border-t pt-3 space-y-3">
                            <DetailItem icon={<BookIcon />} label="Book" value={metadata.book_title} />
                            <DetailItem icon={<InfoIcon />} label="Copy ID" value={`#${metadata.copy_id}`} />
                            <DetailItem icon={<CalendarIcon />} label="Due Date" value={new Date(metadata.due_date).toLocaleDateString('en-GB')} />
                            <DetailItem icon={<ClockIcon />} label="Days Remaining" value={metadata.days_remaining} />
                        </div>
                    </div>
                );
            case 'BORROW_OVERDUE':
                return (
                    <div className="space-y-3">
                        <p className="text-gray-800">{content}</p>
                        <div className="border-t pt-3 space-y-3">
                            <DetailItem icon={<BookIcon />} label="Book" value={metadata.book_title} />
                            <DetailItem icon={<InfoIcon />} label="Copy ID" value={`#${metadata.copy_id}`} />
                            <DetailItem icon={<ClockIcon />} label="Days Overdue" value={metadata.days_overdue} />
                        </div>
                    </div>
                );

            case 'NEW_BORROW_REQUEST':
                 return (
                    <div className="space-y-3">
                        <p className="text-gray-800">{content}</p>
                        <div className="border-t pt-3 space-y-3">
                            <DetailItem icon={<UserIcon />} label="User" value={metadata.username} />
                            <DetailItem icon={<BookIcon />} label="Book" value={metadata.book_title} />
                            <DetailItem icon={<InfoIcon />} label="Copy ID" value={`#${metadata.copy_id}`} />
                            <DetailItem icon={<CalendarIcon />} label="Pickup Date" value={new Date(metadata.pickup_date).toLocaleDateString('en-GB')} />
                        </div>
                    </div>
                );
            case 'NEW_RETURN_REQUEST':
                 return (
                    <div className="space-y-3">
                        <p className="text-gray-800">{content}</p>
                        <div className="border-t pt-3 space-y-3">
                            <DetailItem icon={<UserIcon />} label="User" value={metadata.reader_name} />
                            <DetailItem icon={<BookIcon />} label="Book" value={metadata.book_title} />
                            <DetailItem icon={<InfoIcon />} label="Copy ID" value={`#${metadata.copy_id}`} />
                        </div>
                    </div>
                );

            default:
                return <p className="text-gray-700">{content}</p>;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-[500px] max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                <div className={`${styles.bg} ${styles.border} border-b px-6 py-4 flex items-start justify-between`}>
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`${styles.icon} w-5 h-5 rounded-full mt-1 flex-shrink-0`} />
                        <div className="flex-1">
                            <h2 className={`${styles.text} font-inter text-lg font-semibold`}>{title}</h2>
                            <p className="text-gray-500 text-sm font-inter">{time_ago} ago</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L5 15M5 5L15 15" stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-6 overflow-y-auto flex-1">
                    {renderContent()}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-inter text-sm font-medium hover:bg-gray-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;