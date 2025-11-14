import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByIdAdmin } from "../../services/userAdminService";
import borrowRequestService from "../../services/borrowRequestService";
import borrowingService from "../../services/borrowingService";

const ReaderDetailsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [reader, setReader] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("borrowRequests");
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [returnRequests, setReturnRequests] = useState([]);
    const [borrowingRecords, setBorrowingRecords] = useState([]);
    const [borrowingHistory, setBorrowingHistory] = useState([]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const u = await getUserByIdAdmin(userId);
                if (!mounted) return;
                if (!u) {
                    setReader(null);
                } else {
                    const normalized = {
                        userId: u.user_id != null ? String(u.user_id) : (u.userId ? String(u.userId) : undefined),
                        username: u.username,
                        email: u.email,
                        name: u.name,
                        status: u.status || 'active',
                        profile_picture: u.profile_picture,
                        role: u.role || 'unknown'
                    };
                    setReader(normalized);
                }
            } catch (err) {
                console.error('Failed to load reader:', err);
                setError('Failed to load reader');
                setReader(null);
            } finally {
                setLoading(false);
            }
        };

        load();

        // Also fetch librarian-facing lists (approved requests, return requests, borrowings)
        const loadLists = async () => {
            try {
                const approvedRes = await borrowRequestService.getApprovedRequests();
                const approvedData = approvedRes?.data || approvedRes || [];
                setApprovedRequests(Array.isArray(approvedData) ? approvedData : []);

                const pendingRes = await borrowRequestService.getAllRequests();
                const pendingData = pendingRes?.data || pendingRes || [];
                setPendingRequests(Array.isArray(pendingData) ? pendingData : []);

                const returnRes = await borrowingService.getReturnRequests();
                const returnData = returnRes?.data || returnRes || [];
                setReturnRequests(Array.isArray(returnData) ? returnData : []);

                const borrowingsRes = await borrowingService.getAllBorrowings();
                const borrowingsData = borrowingsRes?.data || borrowingsRes || [];
                const normalizedBorrowings = (Array.isArray(borrowingsData) ? borrowingsData : []).map(b => {
                    // If backend returns flat rows (user_id, reader_name, title, cover) normalize to nested shape
                    const user = b.user || {
                        id: b.user_id || b.userId || b.u_user_id || b.reader_user_id || null,
                        username: b.username || b.reader_name || b.user_name || b.name || null,
                        full_name: b.full_name || b.reader_name || b.name || null,
                        email: b.reader_email || b.email || null
                    };

                    const book = b.book || {
                        id: b.book_id || b.bookId || null,
                        title: b.title || b.bookTitle || b.book_title || null,
                        author: b.author || null,
                        cover: b.cover || b.cover_image_url || b.coverImageUrl || null
                    };

                    return Object.assign({}, b, { user, book });
                });
                setBorrowingRecords(normalizedBorrowings);
            } catch (e) {
                // Non-fatal for the page; log for debugging
                console.debug('Failed to load related lists:', e);
            }
        };

        loadLists();
        return () => { mounted = false; };
    }, [userId]);

    // Fetch borrowing history for this reader (librarian view)
    useEffect(() => {
        if (!reader || !reader.userId) return;
        let mounted = true;
        const fetchHistory = async () => {
            try {
                const res = await borrowingService.getBorrowingHistoryByReader(reader.userId);
                const data = res?.data || res || [];
                if (!mounted) return;
                setBorrowingHistory(Array.isArray(data) ? data : []);
            } catch (e) {
                console.debug('Failed to load borrowing history for reader:', e);
                setBorrowingHistory([]);
            }
        };
        fetchHistory();
        return () => { mounted = false; };
    }, [reader]);

    const userApprovedRequests = reader ? approvedRequests.filter((rec) => {
        // accept multiple shapes from BE: rec.user.id | rec.user_id | rec.user.user_id | rec.user.userId | rec.reader_id
        const userIds = [rec.user?.id, rec.user?.user_id, rec.user?.userId, rec.user_id, rec.reader_id, rec.borrower_id];
        const userNames = [rec.user?.username, rec.user?.full_name, rec.user?.fullName, rec.user?.name, rec.user?.fullName];
        const matchesId = userIds.some(id => id != null && String(id) === String(reader.userId));
        const matchesName = userNames.some(n => n && reader.username && n === reader.username) || rec.user?.full_name === reader.name || rec.user?.full_name === reader.name;
        return matchesId || matchesName;
    }) : [];

    const userBorrowRequests = reader ? pendingRequests.filter((rec) => {
        const userIds = [rec.user?.id, rec.user?.user_id, rec.user?.userId, rec.user_id, rec.reader_id, rec.borrower_id];
        const userNames = [rec.user?.username, rec.user?.full_name, rec.user?.fullName, rec.user?.name];
        const matchesId = userIds.some(id => id != null && String(id) === String(reader.userId));
        const matchesName = userNames.some(n => n && reader.username && n === reader.username) || rec.user?.full_name === reader.name || rec.user?.full_name === reader.name;
        return matchesId || matchesName;
    }) : [];

    const userReturnRequests = reader ? returnRequests.filter((rec) => {
        const userIds = [rec.user?.id, rec.user?.user_id, rec.user?.userId, rec.user_id, rec.reader_id, rec.borrower_id];
        const userNames = [rec.user?.username, rec.user?.full_name, rec.user?.fullName, rec.user?.name];
        const matchesId = userIds.some(id => id != null && String(id) === String(reader.userId));
        const matchesName = userNames.some(n => n && reader.username && n === reader.username) || rec.user?.full_name === reader.name;
        return matchesId || matchesName;
    }) : [];

    const userBorrowingRecords = reader ? borrowingRecords.filter((rec) => {
        const userIds = [rec.user?.id, rec.user?.user_id, rec.user?.userId, rec.user_id, rec.reader_id, rec.borrower_id];
        const userNames = [rec.user?.username, rec.user?.full_name, rec.user?.fullName, rec.user?.name];
        const matchesId = userIds.some(id => id != null && String(id) === String(reader.userId));
        const matchesName = userNames.some(n => n && reader.username && n === reader.username);
        return matchesId || matchesName;
    }) : [];


    const tabs = [
        { id: "borrowRequests", label: "Borrow Requests" },
        { id: "approvedRequests", label: "Approved Requests" },
        { id: "borrowingRecord", label: "Borrowing Record" },
        { id: "returnRequests", label: "Return Requests" },
        { id: "borrowingHistory", label: "Borrow History" },
    ];

    if (loading) return <div className="p-6">Loading reader...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!reader) return <div className="p-6">Reader not found.</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            /* 1/ borrow requests------------------------------------------------------ */
            case "borrowRequests":
                return (
                    <div>
                        {userBorrowRequests.length === 0 ? (
                            <div className="text-gray-500 italic mb-4">
                                This reader has no borrow requests yet.
                            </div>
                        ) : (
                            <div className="grid gap-4 mb-4">
                                {userBorrowRequests.map((req, idx) => {
                                    const book = req.book || req.book_data || req.bookInfo || {};
                                    const cover = book.coverImageUrl || book.cover_image_url || book.cover || book.coverUrl || req.cover || req.cover_image_url || req.book_cover || '';
                                    const title = book.title || book.bookTitle || book.book_title || req.title || req.bookTitle || req.book_title || req.book_name || 'Unknown Title';
                                    const author = book.author || book.authors || req.author || req.authors || '';
                                    return (
                                        <div key={req.requestId || req.request_id || req.id || `borrowReq-${idx}`} className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3">
                                            <img src={cover || 'https://via.placeholder.com/64x96?text=No+Cover'} alt={title} className="w-16 h-24 object-cover rounded-md mr-4" onError={(e) => { e.target.src = 'https://via.placeholder.com/64x96?text=No+Cover'; }} />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{title}</h3>
                                                <p className="text-sm text-gray-600">{author}</p>
                                                <p className="text-xs text-gray-500 mt-1">Requested: {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : (req.request_date ? new Date(req.request_date).toLocaleDateString() : '-')}</p>
                                                <p className="text-xs text-gray-500">Status: {req.status || req.requestStatus || '-'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <button onClick={() => navigate("/borrow-requests")} className="mt-1 text-blue-500 text-sm rounded-md hover:underline transition cursor-pointer">View All Borrow Requests →</button>
                    </div>
                );

            /* 2/ approved requests------------------------------------------------------ */
            case "approvedRequests":
                return (
                    <div>
                        {userApprovedRequests.length === 0 ? (
                            <div className="text-gray-500 italic mb-4">
                                This reader has no approved requests yet.
                            </div>
                        ) : (
                            <div className="grid gap-4 mb-4">
                                {userApprovedRequests.map((record1, idx) => {
                                    const book = record1.book || record1 || {};
                                    const cover = book.coverImageUrl || book.cover_image_url || book.cover || record1.cover || book.coverUrl || '';
                                    const title = book.title || book.bookTitle || record1.title || record1.bookTitle || record1.book_title || 'Unknown Title';
                                    const author = book.author || record1.author || '';
                                    return (
                                        <div
                                            key={record1.id || record1.request_id || `approved-${idx}`}
                                            className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3"
                                        >
                                            <img
                                                src={cover || 'https://via.placeholder.com/64x96?text=No+Cover'}
                                                alt={title}
                                                className="w-16 h-24 object-cover rounded-md mr-4"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x96?text=No+Cover'; }}
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{title}</h3>
                                                <p className="text-sm text-gray-600">{author}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Pickup: {record1.pickupDate || record1.pickup_date || '-'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Return: {record1.returnDate || record1.return_date || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <button
                            onClick={() => navigate("/approved-requests")}
                            className="mt-1 text-blue-500 text-sm rounded-md hover:underline transition cursor-pointer"
                        >
                            View All Approved Requests →
                        </button>
                    </div>
                );

            /* 3/ return requests------------------------------------------------------ */
            case "returnRequests":
                return (
                    <div>
                        {userReturnRequests.length === 0 ? (
                            <div className="text-gray-500 italic mb-4">
                                This reader has no return requests yet.
                            </div>
                        ) : (
                            <div className="grid gap-4 mb-4">
                                {userReturnRequests.map((record2, idx) => {
                                    const book = record2.book || record2 || {};
                                    const cover = book.coverImageUrl || book.cover_image_url || book.cover || record2.cover || '';
                                    const title = book.title || book.bookTitle || record2.bookTitle || record2.title || 'Unknown Title';
                                    const author = book.author || record2.author || '';
                                    return (
                                        <div
                                            key={record2.id || record2.request_id || `return-${idx}`}
                                            className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3"
                                        >
                                            <img
                                                src={cover || 'https://via.placeholder.com/64x96?text=No+Cover'}
                                                alt={title}
                                                className="w-16 h-24 object-cover rounded-md mr-4"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x96?text=No+Cover'; }}
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{title}</h3>
                                                <p className="text-sm text-gray-600">{author}{record2.publish_year ? `, ${record2.publish_year}` : ''}</p>
                                                <p
                                                    className={`text-xs font-medium mt-1 ${record2.status === "ASSESSED"
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                        }`}
                                                >
                                                    Status: {record2.status}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <button
                            onClick={() => navigate("/return-requests")}
                            className="mt-1  text-blue-500 text-sm rounded-md hover:underline transition cursor-pointer"
                        >
                            View All Return Requests →
                        </button>
                    </div>
                );

            /* 4/ borrowing ------------------------------------------------------------ */
            case "borrowingRecord":
                return (
                    <div>
                        {userBorrowingRecords.length === 0 ? (
                            <div className="text-gray-500 italic mb-4">
                                This reader has no borrowing record yet.
                            </div>
                        ) : (
                            <div className="grid gap-4 mb-4">
                                {userBorrowingRecords.map((record, idx) => {
                                    const book = record.book || record || {};
                                    const cover = book.coverImageUrl || book.cover_image_url || book.cover || record.cover || '';
                                    const title = book.title || book.bookTitle || record.title || record.bookTitle || 'Unknown Title';
                                    const author = book.author || record.author || '';
                                    return (
                                        <div
                                            key={record.id || record.borrow_id || `borrowing-${idx}`}
                                            className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3"
                                        >
                                            <img
                                                src={cover || 'https://via.placeholder.com/64x96?text=No+Cover'}
                                                alt={title}
                                                className="w-16 h-24 object-cover rounded-md mr-4"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x96?text=No+Cover'; }}
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{title}</h3>
                                                <p className="text-sm text-gray-600">{author}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Return Date: {record.returnDate || record.return_date || '-'}
                                                </p>
                                                <p
                                                    className={`text-xs font-medium mt-1 ${record.status === "Active"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                        }`}
                                                >
                                                    Status: {record.status}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <button
                            onClick={() => navigate("/borrowing-record")}
                            className="mt-1 text-blue-500 text-sm rounded-md hover:underline transition cursor-pointer"
                        >
                            View Full Borrowing Record →
                        </button>
                    </div>
                );

            /* 5/ borrowing history ------------------------------------------------------------ */
            case "borrowingHistory":
                const history = borrowingHistory || [];

                const totalLateFees = history.reduce((sum, rec) => sum + (rec.late_fee || rec.lateFee || 0), 0);
                const totalDamageFees = history.reduce((sum, rec) => sum + (rec.damage_fee || rec.damageFee || 0), 0);

                return (
                    <div>
                        {/* Stats Summary */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Total Borrowed</p>
                                <p className="text-2xl font-bold text-gray-800">{history.length}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">On Time Returns</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {history.filter(r => r.status === 'on-time' || r.status === 'Returned' || r.status === 'returned').length}
                                </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Total Charges</p>
                                <p className="text-2xl font-bold text-red-600">${totalLateFees + totalDamageFees}</p>
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
                                <div className="col-span-3">Book</div>
                                <div className="col-span-1">Copy</div>
                                <div className="col-span-2">Due Date</div>
                                <div className="col-span-2">Returned</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Total Charge</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {history.map((record, idx) => {
                                    const totalCharge = (record.late_fee || record.lateFee || 0) + (record.damage_fee || record.damageFee || 0);

                                    const book = record.book || {};
                                    const cover = book.cover_image_url || book.cover || book.coverImageUrl || '';
                                    const title = book.title || record.bookTitle || record.title || 'Unknown Title';
                                    const author = book.author || record.author || '';

                                    const returnedCondition = record.returned_condition || record.returnedCondition || record.reader_returned_condition || 0;

                                    return (
                                        <div
                                            key={record.id || record.borrow_id || `history-${idx}`}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                                        >
                                            {/* Book Column with Cover */}
                                            <div className="col-span-3 flex items-center gap-3">
                                                <img
                                                    src={cover || 'https://via.placeholder.com/40x56?text=No+Cover'}
                                                    alt={title}
                                                    className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40x56?text=No+Cover'; }}
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-800 mb-0.5 truncate text-sm">
                                                        {title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 truncate">{author}</p>
                                                </div>
                                            </div>

                                            {/* Copy ID */}
                                            <div className="col-span-1 text-gray-600 text-sm font-mono">
                                                {record.copy_id || record.copyId || '-'}
                                            </div>


                                            {/* Due Date */}
                                            <div className="col-span-2 text-gray-600 text-xs">
                                                {record.due_date ? new Date(record.due_date).toLocaleDateString() : (record.dueDate || '-')}
                                            </div>

                                            {/* Returned Date */}
                                            <div className="col-span-2 text-gray-600 text-xs">
                                                {record.returned_date ? new Date(record.returned_date).toLocaleDateString() : (record.returnedDate || '-')}
                                            </div>
                                            {/* Status */}
                                            <div className="col-span-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap inline-block ${record.status === 'on-time' || record.status === 'Returned' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {(record.status === 'on-time' || record.status === 'Returned' || record.status === 'returned') ? 'On Time' : 'Late'}
                                                </span>
                                            </div>

                                            {/* Total Charge */}
                                            <div className="col-span-2">
                                                {totalCharge > 0 ? (
                                                    <div>
                                                        <span className="text-red-600 font-semibold text-sm">
                                                            ${totalCharge}
                                                        </span>
                                                        {(record.late_fee || record.lateFee) > 0 && (record.damage_fee || record.damageFee) > 0 && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                Late: ${(record.late_fee || record.lateFee)} + Damage: ${(record.damage_fee || record.damageFee)}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">-</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-full
                hover:bg-gray-200 transition-colors cursor-pointer
                text-sm font-medium"
            >
                ← Back
            </button>

            {/* Reader Info */}
            <div className="flex flex-rows mb-6">
                <img
                    src={`https://i.pravatar.cc/100?u=${reader.userId}`}
                    alt={reader.name}
                    className="w-20 h-20 rounded-full border border-gray-300 ml-2 mr-8"
                />
                <div>
                    <div className="flex-1 min-w-0 max-w-[250px] mr-10 flex items-baseline">
                        <h2 className="text-2xl font-semibold text-gray-800 mr-2">
                            {reader.name}
                        </h2>
                        <p className="text-gray-500">{reader.userId}</p>
                    </div>
                    <p className="text-gray-600 mb-2">@{reader.username}</p>
                    <p className="text-gray-500 text-sm mb-1">{reader.email}</p>
                    <div className="flex-1 min-w-0 max-w-[250px] mr-10 flex items-baseline">
                        <p className="text-gray-700 text-sm mr-3">Status:</p>
                        <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${reader.status === "active"
                                ? "bg-green-100 text-green-700"
                                : reader.status === "borrowing"
                                    ? "bg-blue-100 text-blue-700"
                                    : reader.status === "overdue"
                                        ? "bg-yellow-100 text-orange-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                        >
                            {reader.status.charAt(0).toUpperCase() + reader.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`py-2 px-4 text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.id
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>{renderTabContent()}</div>
        </div>
    );
};

export default ReaderDetailsPage;
