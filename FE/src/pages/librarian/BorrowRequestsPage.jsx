import React, { useState, useEffect } from "react";
import borrowRequestService from "../../services/borrowRequestService";

// Approve Modal Component
const ApproveModal = ({ isOpen, onClose, request, onConfirm }) => {
  if (!isOpen || !request) return null;

  const getConditionBadge = (condition) => {
    if (condition >= 80) {
      return { label: 'Excellent', color: 'bg-green-100 text-green-700' };
    } else if (condition >= 60) {
      return { label: 'Good', color: 'bg-blue-100 text-blue-700' };
    } else if (condition >= 50) {
      return { label: 'Fair', color: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { label: 'Poor', color: 'bg-red-100 text-red-700' };
    }
  };

  const handleConfirm = () => {
    onConfirm(request.requestId);
    onClose();
  };

  const condition = request.copy?.condition || 0;
  const badge = getConditionBadge(condition);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Approve Borrow Request</h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to approve this request?
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mt-3">
            <p className="font-semibold text-gray-800">{request.book?.title}</p>
            <p className="text-sm text-gray-600">{request.book?.author}, {request.book?.publicationYear}</p>
            <p className="text-sm text-gray-600 mt-2">Requested by: <span className="font-medium">{request.user?.username}</span></p>
            <p className="text-sm text-gray-600">Pickup: {new Date(request.pickupDate).toLocaleDateString()}</p>

            {/* Copy Info */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Copy to be delivered:</p>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Copy {request.copyId}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${condition >= 80 ? 'bg-green-500' :
                    condition >= 60 ? 'bg-blue-500' :
                      condition >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${condition}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Condition: {condition}%</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

// Reject Modal Component
const RejectModal = ({ isOpen, onClose, request, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    onConfirm(request.requestId, reason);
    handleClose();
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reject Borrow Request</h2>

        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-800">{request.book?.title}</p>
            <p className="text-sm text-gray-600">{request.book?.author}, {request.book?.publicationYear}</p>
            <p className="text-sm text-gray-600 mt-2">Requested by: <span className="font-medium">{request.user?.username}</span></p>
          </div>

          <label className="block mb-2">
            <span className="text-gray-700 font-medium">
              Reason for rejection <span className="text-red-500">*</span>
            </span>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              rows={4}
              placeholder="Please provide a reason for rejecting this request..."
              className={`mt-2 w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 ${error
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
                }`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const BorrowRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowRequestService.getAllRequests();
      setRequests(data.data);
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching borrow requests. Please try again.';
      setError(errorMessage);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (req) => {
    setSelectedRequest(req);
    setIsApproveModalOpen(true);
  };

  const handleReject = (req) => {
    setSelectedRequest(req);
    setIsRejectModalOpen(true);
  };

  const confirmApprove = async (id) => {
    try {
      await borrowRequestService.approveRequest(id);
      fetchRequests(); // Refresh list
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to approve the request. Please try again.';
      setError(errorMessage);
    }
  };

  const confirmReject = async (id, reason) => {
    try {
      await borrowRequestService.rejectRequest(id, reason);
      fetchRequests(); // Refresh list
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reject the request. Please try again.';
      setError(errorMessage);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading requests...</div>;

  return (
    <div className="p-6 bg-[#F3F3F7] min-h-screen">
      <h2 className="text-2xl font-semibold mb-9 text-gray-800">
        Borrow Requests
      </h2>

      {error && (
        <p className="text-center text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F3F3F7] pb-3">
        <div className="flex items-center px-6 gap-6 text-gray-600 font-medium text-sm">
          <div className="w-[300px]">Title</div>
          <div className="w-[100px]">Copy ID</div>
          <div className="w-[100px]">Username</div>
          <div className="w-[150px]">Pick-up Date</div>
          <div className="w-[150px]">Request Date</div>
          <div className="flex-1">Action</div>
        </div>
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-4">
        {requests.length === 0 && !error ? (
          <p className="text-center text-gray-500 mt-8">No pending borrow requests.</p>
        ) : (
          requests.map((req) => {
            const getConditionColor = (condition) => {
              if (condition >= 80) return 'text-green-600';
              if (condition >= 60) return 'text-blue-600';
              if (condition >= 50) return 'text-yellow-600';
              return 'text-red-600';
            };

            return (
              <div
                key={req.requestId}
                className="bg-white rounded-lg shadow p-6 flex items-center gap-6"
              >
                {/* Book Cover + Title */}
                <div className="flex items-center gap-3 w-[300px]">
                  <img
                    src={req.book.coverImageUrl}
                    alt={req.book.title}
                    className="w-16 h-20 object-cover rounded shadow-sm"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{req.book.title}</div>
                    <div className="text-xs text-gray-500">
                      {req.book.author}, {req.book.publicationYear}
                    </div>
                  </div>
                </div>

                {/* Copy ID with condition */}
                <div className="w-[100px]">
                  <div className="font-medium text-gray-900">{req.copyId}</div>
                  <div className={`text-xs font-medium ${getConditionColor(req.copy.condition)}`}>
                    {req.copy.condition}%
                  </div>
                </div>

                {/* User */}
                <div className="w-[100px] text-gray-800">{req.user.username}</div>

                {/* Pick-up Date */}
                <div className="w-[150px] text-gray-800">{new Date(req.pickupDate).toLocaleDateString()}</div>

                {/* Request Date */}
                <div className="w-[150px] text-gray-800">{new Date(req.requestDate).toLocaleDateString()}</div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={() => handleApprove(req)}
                    className="px-4 py-2 border  rounded-lg hover:bg-blue-50 transition text-sm font-medium " style={{ color: '#3273AF' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Approve Modal */}
      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        request={selectedRequest}
        onConfirm={confirmApprove}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        request={selectedRequest}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default BorrowRequestsPage;
