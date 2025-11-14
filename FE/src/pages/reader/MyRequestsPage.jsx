import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestBookCard } from '../../components/MyRequestCard.jsx';
import borrowRequestService from '../../services/borrowRequestService.js';

// Component hiển thị hộp thoại xác nhận hủy yêu cầu
const CancelConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  // Nếu biến `isOpen` là false thì không hiển thị gì
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-xl shadow p-8 min-w-[400px] min-h-[300px] flex flex-col justify-center items-center">
        {/* Tiêu đề của modal */}
        <div className="text-lg font-semibold mb-6 p-5">Cancel request confirmation</div>

        {/* Nút xác nhận hủy */}
        <button
          className="w-40 bg-[#3273AF] text-white py-2 rounded mb-3 font-medium text-lg"
          onClick={onConfirm}
        >
          Confirm
        </button>

        {/* Nút đóng modal */}
        <button
          className="w-40 bg-[#4D4D4D] text-white py-2 rounded font-medium text-lg"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Component chính: MyRequestsPage
const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowRequestService.getReaderRequests();
      setRequests(data.data);
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching your requests. Please try again.';
      setError(errorMessage);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRequest) return;
    try {
      await borrowRequestService.cancelRequest(selectedRequest.requestId);
      setIsModalOpen(false);
      setSelectedRequest(null);
      fetchRequests(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel the request. Please try again.';
      setError(errorMessage);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handlePreview = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading requests...</div>;

  return (
    <div className="bg-[#F3F3F7] min-h-screen pb-10 -m-4 p-4 mt-4">
      <div className="mb-6">
        <h1 className=" font-inter text-2xl font-semibold mb-2 ml-6">
          Your Requests
        </h1>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm mb-4">{error}</p>
      )}

      {requests.length === 0 && !error ? (
        <p className="text-center text-gray-500 mt-8">You have no pending requests.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
          {requests.map((request) => (
            <RequestBookCard
              key={request.requestId}
              coverUrl={request.book.coverImageUrl}
              title={request.book.title}
              author={request.book.author}
              year={request.book.publicationYear}
              requestedAt={new Date(request.requestDate).toLocaleDateString()}
              status={request.status}
              copyId={request.copyId}
              condition={request.condition}
              onCancel={() => handleCancelClick(request)}
              onPreview={() => handlePreview(request.book.id)}
            />
          ))}
        </div>
      )}

      <CancelConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default MyRequestsPage;
