import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

// Helper: Format tiêu đề
const formatTitle = (typeName) => {
    if (!typeName) return 'Notification';
    const str = String(typeName);
    return str.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Helper: Format ngày tháng an toàn
const formatDate = (dateString) => {
    if (!dateString) return 'Check details';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-GB'); // Định dạng ngày/tháng/năm
    } catch (e) {
        return dateString;
    }
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

    // --- 1. CHUẨN HÓA DỮ LIỆU ---
    const type = notification.type || notification.typeName || notification.type_name || "SYSTEM_ALERT";
    const rawPayload = notification.payload || notification.metadata || {};

    // Map dữ liệu (Thêm borrowed_date vào đây)
    const data = {
        book_title: rawPayload.bookTitle || rawPayload.book_title || "Unknown Book",
        author: rawPayload.author || "Unknown Author",

        pickup_date: rawPayload.pickupDate || rawPayload.pickup_date,
        due_date: rawPayload.dueDate || rawPayload.due_date,
        // Thêm dòng này để lấy ngày mượn
        borrowed_date: rawPayload.borrowedDate || rawPayload.borrowed_date || rawPayload.borrow_date,

        copy_id: rawPayload.copyId || rawPayload.copy_id || "?",
        borrow_request_id: rawPayload.borrowRequestId || rawPayload.borrow_request_id,

        rejection_reason: rawPayload.rejectionReason || rawPayload.rejection_reason,
        assessed_condition: rawPayload.assessedCondition || rawPayload.assessed_condition || "N/A",

        damage_fee: Number(rawPayload.damageFee || rawPayload.damage_fee) || 0,
        overdue_fee: Number(rawPayload.overdueFee || rawPayload.overdue_fee) || 0,
        total_fee: Number(rawPayload.totalFee || rawPayload.total_fee) || 0,

        days_remaining: rawPayload.daysRemaining || rawPayload.days_remaining || 0,
        days_overdue: rawPayload.daysOverdue || rawPayload.days_overdue || 0,

        username: rawPayload.username || "User",
        user_email: rawPayload.email || rawPayload.user_email || "No email",
        reader_name: rawPayload.readerName || rawPayload.reader_name || "Reader"
    };

    const content = notification.content || "";
    const time_ago = notification.timeAgo || notification.time_ago || "Just now";

    // Xử lý tiêu đề đặc biệt
    let title = formatTitle(type);
    if (String(type).toUpperCase() === 'PENALTY_ISSUED' && data.total_fee === 0) {
        title = "Return Successful";
    }

    // --- 2. XỬ LÝ MÀU SẮC ---
    const getTypeStyles = (currentType) => {
        const safeType = String(currentType).toUpperCase();

        switch (safeType) {
            case 'NEW_BORROW_REQUEST':
                return { bg: 'bg-[#FFF5F5]', border: 'border-red-100', icon: 'bg-[#F87171]', text: 'text-[#9B2C2C]' };

            case 'NEW_RETURN_REQUEST': // Màu xanh dương mặc định cho Return Request (giống ảnh)
                return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-500', text: 'text-blue-700' };

            case 'BORROW_OVERDUE':
            case 'OVERDUE':
                return { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-500', text: 'text-red-700' };

            case 'PENALTY_ISSUED':
                if (data.total_fee === 0) return { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-500', text: 'text-green-700' };
                return { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-500', text: 'text-red-700' };

            case 'BORROW_DUE_SOON':
                return { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-500', text: 'text-orange-700' };
            case 'REQUEST_APPROVED':
                return { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-500', text: 'text-green-700' };
            case 'REQUEST_REJECTED':
                return { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-500', text: 'text-orange-700' };
            default:
                return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-500', text: 'text-blue-700' };
            case 'REQUEST_EXPIRED':
                return { bg: 'bg-gray-100', border: 'border-gray-300', icon: 'bg-gray-600', text: 'text-gray-800' };
        }
    };

    const styles = getTypeStyles(type);
    const safeType = String(type).toUpperCase();

    // --- 3. RENDER CONTENT ---
    const renderContent = () => {
        // ... (Giữ nguyên các icon helper cũ nếu cần) ...
        const DetailItem = ({ icon, label, value }) => (
            <div className="flex items-start text-sm py-1">
                <div className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400 mt-0.5">{icon}</div>
                <div className="flex-1"><span className="font-semibold text-gray-800">{label}:</span><span className="ml-2 text-gray-600">{value}</span></div>
            </div>
        );
        // ... Icons ... (Đoạn này giữ nguyên để code gọn, tôi không paste lại hết các SVG cũ nhé)
        const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
        const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
        const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>;
        const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


        switch (safeType) {
            case 'NEW_BORROW_REQUEST':
                return (
                    <div className="space-y-6">
                        <div className="space-y-3 px-1">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 font-inter text-sm">User:</span>
                                <span className="text-gray-900 font-inter text-sm font-semibold text-right">{data.username}</span>
                            </div>
                            <div className="flex justify-between items-start"><span className="text-gray-500 font-inter text-sm">Email:</span><span className="text-gray-900 font-inter text-sm text-right">{data.user_email}</span></div>
                            <div className="flex justify-between items-start"><span className="text-gray-500 font-inter text-sm">Book:</span><span className="text-gray-900 font-inter text-sm font-semibold text-right max-w-[60%]">{data.book_title}</span></div>
                            <div className="flex justify-between items-start"><span className="text-gray-500 font-inter text-sm">Pickup Date:</span><span className="text-gray-900 font-inter text-sm font-semibold text-right">{formatDate(data.pickup_date)}</span></div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-gray-600 font-inter text-sm text-center leading-relaxed">
                                Please review this request in the <span className="font-bold text-gray-800">Borrow Requests</span> page to approve or reject.
                            </p>
                        </div>
                    </div>
                );

            case 'NEW_RETURN_REQUEST':
                return (
                    <div className="space-y-6">
                        {/* List thông tin layout 2 bên */}
                        <div className="space-y-3 px-1">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 font-inter text-sm">User:</span>
                                {/* Hiển thị tên user, nếu có ID thì hiện thêm */}
                                <span className="text-gray-900 font-inter text-sm font-semibold text-right">
                                    {data.reader_name || data.username}
                                </span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 font-inter text-sm">Book:</span>
                                <span className="text-gray-900 font-inter text-sm font-semibold text-right max-w-[60%]">
                                    {data.book_title}
                                </span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 font-inter text-sm">Borrowed:</span>
                                <span className="text-gray-900 font-inter text-sm text-right">
                                    {formatDate(data.borrowed_date)}
                                </span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 font-inter text-sm">Due Date:</span>
                                <span className="text-gray-900 font-inter text-sm text-right">
                                    {formatDate(data.due_date)}
                                </span>
                            </div>

                            {/* Dòng Days Overdue ĐỎ ĐẬM nếu > 0 */}
                            {data.days_overdue > 0 && (
                                <div className="flex justify-between items-start">
                                    <span className="text-red-600 font-inter text-sm font-bold">Days Overdue:</span>
                                    <span className="text-red-600 font-inter text-sm font-bold text-right">
                                        {data.days_overdue}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Hộp xám hướng dẫn */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-gray-600 font-inter text-sm leading-relaxed">
                                Please go to <span className="font-bold text-gray-800">Return Requests</span> page to assess the book condition and process the return.
                            </p>
                        </div>
                    </div>
                );

            // ... (Giữ nguyên các case khác: REQUEST_APPROVED, REJECTED, PENALTY, OVERDUE, DUE_SOON)
            case 'REQUEST_APPROVED':
                return (
                    <div className="space-y-5">
                        <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-4 shadow-sm">
                            <div className="flex gap-3">
                                <div className="mt-0.5"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                                <div><p className="text-[#059669] font-inter text-[15px] font-bold mb-1">Your request has been approved!</p><p className="text-[#065F46] font-inter text-sm leading-relaxed">Please pick up the book by <span className="font-bold">{formatDate(data.pickup_date)}</span> before 20:00.</p></div>
                            </div>
                        </div>
                        <div className="space-y-3 px-1">
                            <div className="flex items-start"><span className="w-28 text-gray-500 font-inter text-sm font-medium">Book:</span><span className="flex-1 text-gray-900 font-inter text-sm font-semibold">{data.book_title}</span></div>
                            <div className="flex items-start"><span className="w-28 text-gray-500 font-inter text-sm font-medium">Pickup Date:</span><span className="flex-1 text-gray-900 font-inter text-sm font-medium">{formatDate(data.pickup_date)}</span></div>
                            <div className="flex items-start"><span className="w-28 text-gray-500 font-inter text-sm font-medium">Request ID:</span><span className="flex-1 text-gray-500 font-inter text-sm font-mono">{data.borrow_request_id ? `#${data.borrow_request_id}` : 'N/A'}</span></div>
                        </div>
                    </div>
                );
            case 'REQUEST_REJECTED':
                return (
                    <div className="space-y-5">
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <h3 className="text-[#C05621] font-inter text-[15px] font-bold mb-1">Request Rejected</h3>
                            <p className="text-gray-700 font-inter text-sm">Your borrow request for <span className="font-semibold">"{data.book_title}"</span> was rejected.</p>
                        </div>
                        <div>
                            <p className="text-gray-900 font-inter text-sm font-bold mb-2">Reason:</p>
                            <div className="bg-gray-50 rounded-xl p-4"><p className="text-gray-600 font-inter text-sm leading-relaxed">{data.rejection_reason || "The librarian did not provide a specific reason."}</p></div>
                        </div>
                    </div>
                );
            case 'PENALTY_ISSUED':
                if (data.total_fee === 0) {
                    return (
                        <div className="space-y-5">
                            <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-4 shadow-sm">
                                <div className="flex gap-3">
                                    <div className="mt-0.5"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                                    <div><p className="text-[#059669] font-inter text-[15px] font-bold mb-1">Return Successful</p><p className="text-[#065F46] font-inter text-sm leading-relaxed">Book returned in <span className="font-bold">{data.assessed_condition}</span> condition. No fees applied.</p></div>
                                </div>
                            </div>
                            <div className="px-1 space-y-2">
                                <div className="flex items-start"><span className="w-24 text-gray-500 font-inter text-sm font-medium">Book:</span><span className="flex-1 text-gray-900 font-inter text-sm font-semibold">{data.book_title}</span></div>
                                <div className="flex items-start"><span className="w-24 text-gray-500 font-inter text-sm font-medium">Copy ID:</span><span className="flex-1 text-gray-900 font-inter text-sm font-mono">#{data.copy_id}</span></div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="space-y-5">
                        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
                            <h3 className="text-[#B91C1C] font-inter text-[15px] font-bold mb-1">Payment Required</h3>
                            <p className="text-gray-700 font-inter text-sm">Please pay at the library counter before picking up your next book.</p>
                        </div>
                        <div className="space-y-2 px-1">
                            <div className="flex items-start"><span className="w-24 text-gray-800 font-inter text-sm font-bold">Book:</span><span className="text-gray-600 font-inter text-sm">{data.book_title}</span></div>
                            <div className="flex items-start"><span className="w-24 text-gray-800 font-inter text-sm font-bold">Assessed:</span><span className="text-gray-600 font-inter text-sm">{data.assessed_condition}</span></div>
                        </div>
                        <div className="pt-2">
                            <p className="font-bold text-gray-900 font-inter text-sm mb-3">Breakdown:</p>
                            <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                                {data.overdue_fee > 0 && (<div className="flex justify-between items-center text-sm"><span className="text-gray-600 font-inter">Late fee</span><span className="font-medium text-gray-900 font-inter">{data.overdue_fee.toLocaleString()} đ</span></div>)}
                                {data.damage_fee > 0 && (<div className="flex justify-between items-center text-sm"><span className="text-gray-600 font-inter">Damage fee</span><span className="font-medium text-gray-900 font-inter">{data.damage_fee.toLocaleString()} đ</span></div>)}
                            </div>
                            <div className="flex justify-between items-end"><span className="font-bold text-gray-900 font-inter text-base">Total:</span><span className="font-bold text-[#DC2626] font-inter text-xl">{data.total_fee.toLocaleString()} đ</span></div>
                        </div>

                        {/* QR Code Section */}
                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-600 font-inter mb-4">Scan the QR code below to complete the payment.</p>
                            <div className="flex justify-center">
                                <img src={assets.qr_code} alt="Payment QR Code" className="w-48 h-48 rounded-lg shadow-md" />
                            </div>
                        </div>
                    </div>
                );
            case 'BORROW_DUE_SOON':
                return (
                    <div className="space-y-5">
                        <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2"><span className="text-lg">⏰</span><h3 className="text-[#854D0E] font-inter text-[15px] font-bold">Book due in {data.days_remaining} days</h3></div>
                            <p className="text-gray-700 font-inter text-sm leading-relaxed ml-1">Please return or renew <span className="font-semibold">"{data.book_title}"</span> before {formatDate(data.due_date)}.</p>
                        </div>
                        <div className="px-1"><div className="flex items-center"><span className="text-gray-800 font-inter text-sm font-bold mr-2">Due Date:</span><span className="text-gray-600 font-inter text-sm">{formatDate(data.due_date)}</span></div></div>
                    </div>
                );
            case 'BORROW_OVERDUE':
            case 'OVERDUE':
                return (
                    <div className="space-y-5">
                        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2"><span className="text-lg">⚠️</span><h3 className="text-[#B91C1C] font-inter text-[15px] font-bold">Book Overdue</h3></div>
                            <p className="text-gray-700 font-inter text-sm leading-relaxed ml-1"><span className="font-semibold">"{data.book_title}"</span> is {data.days_overdue} days overdue. Late fees apply.</p>
                        </div>
                        <div className="px-1 space-y-2">
                            <div className="flex items-center"><span className="text-gray-800 font-inter text-sm font-bold w-28">Due Date:</span><span className="text-gray-600 font-inter text-sm">{formatDate(data.due_date)}</span></div>
                            <div className="flex items-center"><span className="text-gray-800 font-inter text-sm font-bold w-28">Days Overdue:</span><span className="text-gray-600 font-inter text-sm">{data.days_overdue}</span></div>
                        </div>
                    </div>
                );
            case 'REQUEST_EXPIRED':
                return (
                    <div className="space-y-5">
                        {/* 1. Khung cảnh báo màu xám */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                {/* Icon đồng hồ cát hoặc dấu chéo */}
                                <span className="text-lg">⏳</span>
                                <h3 className="text-gray-800 font-inter text-[15px] font-bold">
                                    Pickup Missed
                                </h3>
                            </div>
                            <p className="text-gray-600 font-inter text-sm leading-relaxed ml-1">
                                You did not pick up the book by the deadline. This request has been cancelled.
                            </p>
                        </div>

                        {/* 2. Chi tiết */}
                        <div className="px-1 space-y-2">
                            <div className="flex items-start">
                                <span className="w-28 text-gray-500 font-inter text-sm font-medium">Book:</span>
                                <span className="flex-1 text-gray-900 font-inter text-sm font-semibold">
                                    {data.book_title}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="w-28 text-gray-500 font-inter text-sm font-medium">Expired On:</span>
                                <span className="flex-1 text-gray-900 font-inter text-sm font-medium">
                                    {formatDate(data.pickup_date)} 20:00
                                </span>
                            </div>
                        </div>

                        {/* 3. Lời nhắn nhỏ */}
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500 italic">
                                Please submit a new request if you still need this book.
                            </p>
                        </div>
                    </div>
                );

            default:
                return <p className="text-gray-700">{content}</p>;
        }
    };

    // Helper xác định có nút action hay không (dùng trong footer)
    const hasActionButton = safeType === 'NEW_BORROW_REQUEST' || safeType === 'NEW_RETURN_REQUEST';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-[500px] max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
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

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto flex-1">
                    {renderContent()}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-inter text-sm font-medium hover:bg-gray-50 transition-colors">
                        Close
                    </button>

                    {/* Nút Action màu xanh (Dùng chung cho cả Borrow và Return request) */}
                    {hasActionButton && (
                        <button
                            onClick={() => {
                                onClose();
                                const path = safeType === 'NEW_BORROW_REQUEST' ? '/borrow-requests' : '/return-requests';
                                navigate(path);
                            }}
                            className="px-5 py-2.5 rounded-full bg-[#3B82F6] text-white font-inter text-sm font-medium hover:bg-[#2563EB] transition-colors"
                        >
                            {safeType === 'NEW_BORROW_REQUEST' ? 'Go to Borrow Requests' : 'Go to Return Requests'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;