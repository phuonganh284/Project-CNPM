import React, { useState } from "react";
import { mockBorrowRequests } from "../../data/mockBorrowRequests";

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
    onConfirm(request.id);
    onClose();
  };

  const badge = getConditionBadge(request.copyCondition || 80);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Approve Borrow Request</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to approve this request?
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mt-3">
            <p className="font-semibold text-gray-800">{request.title}</p>
            <p className="text-sm text-gray-600">{request.author}, {request.year}</p>
            <p className="text-sm text-gray-600 mt-2">Requested by: <span className="font-medium">{request.user}</span></p>
            <p className="text-sm text-gray-600">Pickup: {request.pickupDate}</p>
            
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
                  className={`h-1.5 rounded-full ${
                    request.copyCondition >= 80 ? 'bg-green-500' :
                    request.copyCondition >= 60 ? 'bg-blue-500' :
                    request.copyCondition >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${request.copyCondition}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Condition: {request.copyCondition}%</p>
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
    onConfirm(request.id, reason);
    handleClose();
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reject Borrow Request</h2>
        
        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-800">{request.title}</p>
            <p className="text-sm text-gray-600">{request.author}, {request.year}</p>
            <p className="text-sm text-gray-600 mt-2">Requested by: <span className="font-medium">{request.user}</span></p>
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
              className={`mt-2 w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
                error 
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
  const [requests, setRequests] = useState(mockBorrowRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleApprove = (req) => {
    setSelectedRequest(req);
    setIsApproveModalOpen(true);
  };

  const handleReject = (req) => {
    setSelectedRequest(req);
    setIsRejectModalOpen(true);
  };

  const confirmApprove = (id) => {
    // TODO: KHI CÓ BE - Call API để approve request (copyId đã có sẵn trong request)
    setRequests((prev) =>
      prev.filter((r) => r.id !== id) // Xóa request khỏi danh sách
    );
    console.log(`Request ${id} approved`);
    // Backend sẽ:
    // 1. Update borrow_requests: set status='approved'
    // 2. Create borrowing_records với borrowed_condition và borrowed_copy_price từ copy hiện tại
    // 3. Update book_copies: set availability=false
  };

  const confirmReject = (id, reason) => {
    // TODO: KHI CÓ BE - Call API để reject request với lý do
    setRequests((prev) =>
      prev.filter((r) => r.id !== id) // Xóa request khỏi danh sách
    );
    console.log(`Request ${id} rejected with reason: ${reason}`);
  };

  return (
    <div className="p-6 bg-[#F3F3F7] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Borrow Requests
      </h2>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F3F3F7] pb-3">
        <div className="flex items-center px-6 gap-6 text-gray-600 font-medium text-sm">
          <div className="w-[300px]">Title</div>
          <div className="w-[100px]">Copy ID</div>
          <div className="w-[100px]">User</div>
          <div className="w-[150px]">Pick-up Date</div>
          <div className="w-[150px]">Return Date</div>
          <div className="flex-1">Action</div>
        </div>
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-4">
        {requests.map((req) => {
          const getConditionColor = (condition) => {
            if (condition >= 80) return 'text-green-600';
            if (condition >= 60) return 'text-blue-600';
            if (condition >= 50) return 'text-yellow-600';
            return 'text-red-600';
          };

          return (
            <div
              key={req.id}
              className="bg-white rounded-lg shadow p-6 flex items-center gap-6"
            >
              {/* Book Cover + Title */}
              <div className="flex items-center gap-3 w-[300px]">
                <img
                  src={req.coverUrl}
                  alt={req.title}
                  className="w-16 h-20 object-cover rounded shadow-sm"
                />
                <div>
                  <div className="font-semibold text-gray-900">{req.title}</div>
                  <div className="text-xs text-gray-500">
                    {req.author}, {req.year}
                  </div>
                </div>
              </div>

              {/* Copy ID with condition */}
              <div className="w-[100px]">
                <div className="font-medium text-gray-900">{req.copyId}</div>
                <div className={`text-xs font-medium ${getConditionColor(req.copyCondition)}`}>
                  {req.copyCondition}%
                </div>
              </div>

              {/* User */}
              <div className="w-[100px] text-gray-800">{req.user}</div>

              {/* Pick-up Date */}
              <div className="w-[150px] text-gray-800">{req.pickupDate}</div>

              {/* Return Date */}
              <div className="w-[150px] text-gray-800">{req.returnDate}</div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-1">
                <button
                  onClick={() => handleApprove(req)}
                  className="px-4 py-2 border  rounded-lg hover:bg-blue-50 transition text-sm font-medium "style={{ color: '#3273AF' }}
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
        })}
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
