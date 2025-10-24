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
