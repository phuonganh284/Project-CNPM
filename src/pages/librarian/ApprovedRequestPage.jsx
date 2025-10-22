import React, { useState } from 'react';
import RequestRow from '../../components/RequestRow.jsx';
import { mockApprovedRequests } from '../../data/mockApprovedRequests.js';

const ApprovedRequestPage = () => {
    const [requests, setRequests] = useState(mockApprovedRequests);
    const [message, setMessage] = useState('');

    const handleConfirmDelivery = (requestId) => {
        const deliveredRequest = requests.find(req => req.id === requestId);
        
        const updatedRequests = requests.filter(req => req.id !== requestId);
        setRequests(updatedRequests);

        setMessage(`Confirmed delivery for "${deliveredRequest.title}" to user ${deliveredRequest.user}. The book is now officially borrowed.`);

        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    return (
        <div className="p-4 sm:p-6 min-h-screen font-sans">
            
            {/* Header and Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Approved Delivery Requests</h2>
            </div>

            {/* Success Message */}
            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 shadow-md" role="alert">
                    <span className="font-semibold">Success! </span>
                    <span className="block sm:inline">{message}</span>
                </div>
            )}

            {/* Column Headers (Sticky) */}
            <div className="hidden sm:flex items-center text-xs font-semibold uppercase text-gray-600 bg-gray-200 py-3 px-4 rounded-lg mb-3 shadow-inner sticky top-0 z-10">
                <div className="w-[35%]">Title</div>
                <div className="w-[15%]">User</div>
                <div className="w-[20%]">Pick-up Date</div>
                <div className="w-[20%]">Return Date</div>
                <div className="w-[10%] text-right">Action</div>
            </div>

            {/* Request List */}
            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <RequestRow
                            key={request.id}
                            request={request}
                            onConfirmDelivery={handleConfirmDelivery}
                        />
                    ))
                ) : (
                    <div className="text-center p-10 bg-white rounded-lg border border-gray-200 shadow-md">
                        <p className="text-gray-500 text-lg font-medium">No approved requests are currently awaiting delivery confirmation. 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApprovedRequestPage;