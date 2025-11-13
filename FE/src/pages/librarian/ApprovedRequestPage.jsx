import React, { useState, useEffect } from 'react';
import RequestRow from '../../components/RequestRow.jsx';
import borrowRequestService from '../../services/borrowRequestService.js';
import borrowingService from '../../services/borrowingService.js';

const ApprovedRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const fetchApprovedRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowRequestService.getApprovedRequests();
      setRequests(data.data);
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching approved requests. Please try again.';
      setError(errorMessage);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const handleConfirmDelivery = async (requestId) => {
    try {
      await borrowingService.confirmPickup(requestId); 
      
      const deliveredRequest = requests.find(req => req.id === requestId);
      setMessage(`Confirmed delivery for "${deliveredRequest.book.title}" to user ${deliveredRequest.user.full_name}. The book is now officially borrowed.`);
      fetchApprovedRequests(); // Refresh the list

      setTimeout(() => {
        setMessage('');
      }, 5000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to confirm delivery: ${err.toString()}`;
      setError(errorMessage);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading approved requests...</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen font-sans">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Approved Delivery Requests</h2>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 shadow-md" role="alert">
          <span className="font-semibold">Success! </span>
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="hidden sm:flex items-center text-sm font-medium text-gray-600 bg-[#F3F3F7] py-3 px-6 mb-4 sticky top-0 z-10">
        <div className="w-[25%]">Title</div>
        <div className="w-[12%]">User</div>
        <div className="w-[10%]">Copy ID</div>
        <div className="w-[13%]">Condition</div>
        <div className="w-[15%]">Pick-up Date</div>
        <div className="w-[15%]">Requested At</div>
        <div className="w-[10%] text-right">Action</div>
      </div>

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
          !error && (
            <div className="text-center p-10 bg-white rounded-lg border border-gray-200 shadow-md">
              <p className="text-gray-500 text-lg font-medium">No approved requests are currently awaiting delivery confirmation. 🎉</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ApprovedRequestPage;