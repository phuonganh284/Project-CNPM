import React from "react";
import { Button } from "../button";

const BorrowConfirmationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[400px] p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Process Completed
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Your borrow request have been to catalog you'll have finish given for
          you to pick-up the book properly, atleast, it's one of the best
          mind-blowing book about UI/UX design.
        </p>

        {/* Back Button */}
        <Button
          onClick={onClose}
          className="w-full max-w-[200px] mx-auto bg-gray-700 hover:bg-gray-800 text-white"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default BorrowConfirmationModal;
