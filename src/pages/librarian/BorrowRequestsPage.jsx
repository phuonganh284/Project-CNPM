import React, { useState } from "react";
import { mockBorrowRequests } from "../../data/mockBorrowRequests";
import ApproveDrawer from "../../components/ApproveDrawer";

const BorrowRequestsPage = () => {
  const [requests, setRequests] = useState(mockBorrowRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleApprove = (req) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
    );
  };

  const handleSaveApproval = (requestId, approvalData) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: approvalData.approved ? "APPROVED" : "REJECTED" }
          : r
      )
    );
    setIsDrawerOpen(false);
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
          <div className="w-[100px]">User</div>
          <div className="w-[150px]">Pick-up Date</div>
          <div className="w-[150px]">Return Date</div>
          <div className="flex-1">Action</div>
        </div>
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-4">
        {requests.map((req) => (
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
                onClick={() => handleReject(req.id)}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition text-sm font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Approve Drawer */}
      <ApproveDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        borrowRequest={selectedRequest}
        onSave={handleSaveApproval}
      />
    </div>
  );
};

export default BorrowRequestsPage;
