import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockReaders } from "../../data/mockReaders";
import { mockApprovedRequests } from "../../data/mockApprovedRequests";
import { mockReturnRequests } from "../../data/mockReturnRequests";
import { mockBorrowing } from "../../data/mockBorrowing";

const ReaderDetailsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const reader = mockReaders.find((r) => r.userId === userId);

    const [activeTab, setActiveTab] = useState("borrowRequests");

    if (!reader) {
        return <div className="p-6">Reader not found.</div>;
    }

    const userApprovedRequests = mockApprovedRequests.filter(
        (record1) => record1.user === reader.username
    );
    const userReturnRequests = mockReturnRequests.filter(
        (record2) => record2.userName === reader.username
    );
    const userBorrowingRecords = mockBorrowing.filter(
        (record) => record.user === reader.username
    );


    const tabs = [
        { id: "borrowRequests", label: "Borrow Requests" },
        { id: "approvedRequests", label: "Approved Requests" },
        { id: "returnRequests", label: "Return Requests" },
        { id: "borrowingRecord", label: "Borrowing Record" },
        { id: "borrowingHistory", label: "Borrowing History" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            /* 1/ borrow requests------------------------------------------------------ */
            case "borrowRequests":
                return (
                    <div>
                        <div className="text-gray-500 italic mb-4">
                            This reader has no borrow requests yet.
                        </div>
                        <button
                            onClick={() => navigate("/borrow-requests")}
                            className="mt-1 text-blue-500 text-sm rounded-md hover:underline transition cursor-pointer"
                        >
                            View All Borrow Requests →
                        </button>
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
                                {userApprovedRequests.map((record1) => (
                                    <div
                                        key={record1.id}
                                        className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3"
                                    >
                                        <img
                                            src={record1.cover}
                                            alt={record1.title}
                                            className="w-16 h-24 object-cover rounded-md mr-4"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{record1.title}</h3>
                                            <p className="text-sm text-gray-600">{record1.author}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Pickup: {record1.pickupDate}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Return: {record1.returnDate}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
                                {userReturnRequests.map((record2) => (
                                    <div
                                        key={record2.id}
                                        className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3"
                                    >
                                        <img
                                            src={record2.cover}
                                            alt={record2.bookTitle}
                                            className="w-16 h-24 object-cover rounded-md mr-4"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{record2.bookTitle}</h3>
                                            <p className="text-sm text-gray-600">{record2.author}, {record2.publish_year}</p>
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
                                ))}
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
                                {userBorrowingRecords.map((record) => (
                                    <div
                                        key={record.id}
                                        className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3"
                                    >
                                        <img
                                            src={record.cover}
                                            alt={record.title}
                                            className="w-16 h-24 object-cover rounded-md mr-4"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{record.title}</h3>
                                            <p className="text-sm text-gray-600">{record.author}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Return Date: {record.returnDate}
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
                                ))}
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
                // TODO: KHI CÓ BE - Fetch borrowing history của reader này từ API
                const mockHistory = [
                    {
                        id: 1,
                        loanId: "L101",
                        copyId: "C005",
                        bookTitle: "The Great Gatsby",
                        author: "F. Scott Fitzgerald",
                        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
                        borrowedDate: "2024-10-01",
                        returnedDate: "2024-10-15",
                        dueDate: "2024-10-14",
                        status: "Returned",
                        lateFee: 0,
                        borrowedCondition: 90,
                        returnedCondition: 85,
                        damageFee: 5,
                    },
                    {
                        id: 2,
                        loanId: "L102",
                        copyId: "C008",
                        bookTitle: "To Kill a Mockingbird",
                        author: "Harper Lee",
                        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
                        borrowedDate: "2024-09-15",
                        returnedDate: "2024-10-05",
                        dueDate: "2024-09-29",
                        status: "Returned Late",
                        lateFee: 10,
                        borrowedCondition: 75,
                        returnedCondition: 70,
                        damageFee: 5,
                    },
                    {
                        id: 3,
                        loanId: "L103",
                        copyId: "C011",
                        bookTitle: "1984",
                        author: "George Orwell",
                        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",
                        borrowedDate: "2024-08-20",
                        returnedDate: "2024-09-10",
                        dueDate: "2024-09-15",
                        status: "Returned",
                        lateFee: 0,
                        borrowedCondition: 100,
                        returnedCondition: 95,
                        damageFee: 5,
                    },
                ];

                const totalLateFees = mockHistory.reduce((sum, record) => sum + record.lateFee, 0);
                const totalDamageFees = mockHistory.reduce((sum, record) => sum + (record.damageFee || 0), 0);

                return (
                    <div>
                        {/* Stats Summary */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Total Borrowed</p>
                                <p className="text-2xl font-bold text-gray-800">{mockHistory.length}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">On Time Returns</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {mockHistory.filter(r => r.status === 'Returned').length}
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
                                <div className="col-span-1">Borrowed</div>
                                <div className="col-span-1">Due Date</div>
                                <div className="col-span-1">Returned</div>
                                <div className="col-span-2">Assessed Condition</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-2">Total Charge</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {mockHistory.map((record) => {
                                    const totalCharge = (record.lateFee || 0) + (record.damageFee || 0);
                                    
                                    return (
                                        <div
                                            key={record.id}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                                        >
                                            {/* Book Column with Cover */}
                                            <div className="col-span-3 flex items-center gap-3">
                                                <img
                                                    src={record.coverUrl}
                                                    alt={record.bookTitle}
                                                    className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/40x56?text=No+Cover';
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-800 mb-0.5 truncate text-sm">
                                                        {record.bookTitle}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 truncate">{record.author}</p>
                                                </div>
                                            </div>

                                            {/* Copy ID */}
                                            <div className="col-span-1 text-gray-600 text-sm font-mono">
                                                {record.copyId}
                                            </div>

                                            {/* Borrowed Date */}
                                            <div className="col-span-1 text-gray-600 text-xs">
                                                {record.borrowedDate}
                                            </div>

                                            {/* Due Date */}
                                            <div className="col-span-1 text-gray-600 text-xs">
                                                {record.dueDate}
                                            </div>

                                            {/* Returned Date */}
                                            <div className="col-span-1 text-gray-600 text-xs">
                                                {record.returnedDate}
                                            </div>

                                            {/* Assessed Condition */}
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-semibold text-sm ${
                                                        record.returnedCondition >= 80 ? 'text-green-600' :
                                                        record.returnedCondition >= 60 ? 'text-blue-600' :
                                                        record.returnedCondition >= 50 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                        {record.returnedCondition}%
                                                    </span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                                                        <div 
                                                            className={`h-1.5 rounded-full ${
                                                                record.returnedCondition >= 80 ? 'bg-green-500' :
                                                                record.returnedCondition >= 60 ? 'bg-blue-500' :
                                                                record.returnedCondition >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${record.returnedCondition}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {record.returnedCondition >= 80 ? 'Excellent' :
                                                     record.returnedCondition >= 60 ? 'Good' :
                                                     record.returnedCondition >= 50 ? 'Fair' : 'Poor'}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-1">
                                                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap inline-block ${
                                                    record.status === 'Returned' 
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {record.status === 'Returned' ? 'On Time' : 'Late'}
                                                </span>
                                            </div>

                                            {/* Total Charge */}
                                            <div className="col-span-2">
                                                {totalCharge > 0 ? (
                                                    <div>
                                                        <span className="text-red-600 font-semibold text-sm">
                                                            ${totalCharge}
                                                        </span>
                                                        {record.lateFee > 0 && record.damageFee > 0 && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                Late: ${record.lateFee} + Damage: ${record.damageFee}
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
