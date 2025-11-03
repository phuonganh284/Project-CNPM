import React, { useState, useEffect } from "react";

const ApproveDrawer = ({ isOpen, onClose, borrowRequest, onSave }) => {
  const [approved, setApproved] = useState(false);
  const [notes, setNotes] = useState("");

  // Reset form when borrowRequest changes
  useEffect(() => {
    if (borrowRequest) {
      setApproved(true); // default approve to true, adjust as needed
      setNotes("");
    }
  }, [borrowRequest]);

  if (!isOpen || !borrowRequest) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(borrowRequest.id, { approved, notes });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="bg-white w-96 min-h-full p-6 shadow-lg flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Approve Borrow Request</h2>
        <p className="mb-4">
          Book: <strong>{borrowRequest.title}</strong> by {borrowRequest.author}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
            />
            Approve this request
          </label>
          <label>
            <span className="block mb-1">Notes (optional):</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded-md resize-none"
            />
          </label>
          <div className="mt-auto flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApproveDrawer;
