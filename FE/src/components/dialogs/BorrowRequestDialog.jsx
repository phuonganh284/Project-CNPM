import React, { useState, useEffect } from "react";
import { Button } from "../button";

const BorrowRequestDialog = ({ isOpen, onClose, book, copy, onConfirm }) => {
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  const requestDate = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })(); // Dynamically get current date for display
  console.log("Debug: Current new Date() object:", new Date());
  console.log("Debug: Formatted requestDate:", requestDate);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!copy) {
      console.error("No copy available to request.");
      // Optionally, show an error to the user
      return;
    }
    const requestData = {
      book_id: book?.book_id,
      copy_id: copy?.copy_id,
      pickup_date: pickupDate,
    };
    if (onConfirm) {
      onConfirm(requestData);
    }
  };

  const getConditionLabel = (condition) => {
    if (condition >= 80) return 'Excellent';
    if (condition >= 60) return 'Good';
    if (condition >= 50) return 'Fair';
    return 'Poor';
  };

  const condition = copy?.condition || 0;
  const conditionLabel = getConditionLabel(condition);

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[450px] p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Borrow Request Details
        </h2>

        {book && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Requesting:</p>
            <p className="font-semibold text-gray-800">{book.title}</p>
            <p className="text-sm text-gray-500">{book.author}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requested on
          </label>
          <input
            type="date"
            value={requestDate}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pick-up date
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} // Min date is tomorrow
            max={new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]} // Max date is 14 days from now
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {copy ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              You will receive:
            </label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-semibold text-gray-900 text-base">
                  Copy {copy.copy_id}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${condition >= 80 ? 'bg-green-100 text-green-700' :
                    condition >= 60 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                  }`}>
                  {conditionLabel}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-1">Condition</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${condition >= 80 ? 'bg-green-500' :
                      condition >= 60 ? 'bg-blue-500' :
                        'bg-yellow-500'
                    }`}
                  style={{ width: `${condition}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{condition}%</div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
            <p className="text-sm text-yellow-800">No copies are available for this book right now.</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!copy}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
          >
            Request Borrow
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BorrowRequestDialog;
