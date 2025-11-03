import React, { useState } from "react";
import { Button } from "../button";

const BorrowRequestDialog = ({ isOpen, onClose, book, onConfirm }) => {
  const [requestDate, setRequestDate] = useState(() => {
    const today = new Date();
    return {
      day: String(today.getDate()).padStart(2, "0"),
      month: String(today.getMonth() + 1).padStart(2, "0"),
      year: today.getFullYear(),
    };
  });

  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      day: String(tomorrow.getDate()).padStart(2, "0"),
      month: String(tomorrow.getMonth() + 1).padStart(2, "0"),
      year: tomorrow.getFullYear(),
    };
  });

  const [bookSerialNo, setBookSerialNo] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const requestData = {
      bookId: book?.id,
      bookTitle: book?.title,
      requestedOn: `${requestDate.day}-${requestDate.month}-${requestDate.year}`,
      pickupDate: `${pickupDate.day}-${pickupDate.month}-${pickupDate.year}`,
      bookSerialNo: bookSerialNo,
    };
    console.log('Borrow request submitted:', requestData);
    // Call the parent's onConfirm callback
    if (onConfirm) {
      onConfirm(requestData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[450px] p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Borrow Request Details
          </h2>
          
          {/* Book Title */}
          {book && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Requesting:</p>
              <p className="font-semibold text-gray-800">{book.title}</p>
              <p className="text-sm text-gray-500">{book.author}</p>
            </div>
          )}

        {/* Requested on Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requested on
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={requestDate.day}
              onChange={(e) =>
                setRequestDate({ ...requestDate, day: e.target.value })
              }
              className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center"
              placeholder="DD"
              maxLength={2}
            />
            <input
              type="text"
              value={requestDate.month}
              onChange={(e) =>
                setRequestDate({ ...requestDate, month: e.target.value })
              }
              className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center"
              placeholder="MM"
              maxLength={2}
            />
            <input
              type="text"
              value={requestDate.year}
              onChange={(e) =>
                setRequestDate({ ...requestDate, year: e.target.value })
              }
              className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center"
              placeholder="YYYY"
              maxLength={4}
            />
          </div>
        </div>

        {/* Pick-up date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pick-up date
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pickupDate.day}
              onChange={(e) =>
                setPickupDate({ ...pickupDate, day: e.target.value })
              }
              className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center"
              placeholder="DD"
              maxLength={2}
            />
            <input
              type="text"
              value={pickupDate.month}
              onChange={(e) =>
                setPickupDate({ ...pickupDate, month: e.target.value })
              }
              className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center"
              placeholder="MM"
              maxLength={2}
            />
            <input
              type="text"
              value={pickupDate.year}
              onChange={(e) =>
                setPickupDate({ ...pickupDate, year: e.target.value })
              }
              className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center"
              placeholder="YYYY"
              maxLength={4}
            />
          </div>
        </div>

        {/* Book Serial No */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Serial No.
          </label>
          <input
            type="text"
            value={bookSerialNo}
            onChange={(e) => setBookSerialNo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="98043023"
          />
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 mb-6 italic">
          Please note where or notify you! Time frame given for you to pick-up
          the book. It's one of the best mind-blowing book about UI/UX design.{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Read more...
          </span>
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
