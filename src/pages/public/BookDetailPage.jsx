// src/pages/public/BookDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockBooks } from "../../data/mockBooks";
import { mockBorrows } from "../../data/mockBorrows";
import { Button } from "../../components/button";
import { useAuth } from "../../context/AuthContext";
import BorrowRequestDialog from "../../components/dialogs/BorrowRequestDialog";
import BorrowConfirmationModal from "../../components/dialogs/BorrowConfirmationModal";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import BookEditDialog from "../../components/dialogs/BookEditDialog";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book] = useState(() => mockBooks.find((b) => b.id === parseInt(id)));
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Check if current user has borrowed this book
  const userBorrow = mockBorrows.find((borrow) => borrow.id === parseInt(id));
  const isBorrowedByUser = userBorrow && user?.role === "reader";

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h2>
          <Button onClick={() => navigate("/browse")}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const getStatusConfig = () => {
    // If user has borrowed this book
    if (isBorrowedByUser) {
      return {
        label: "You borrowed this book",
        className: "bg-blue-100 text-blue-700",
        buttonText: "VIEW MY BORROWS",
        buttonDisabled: false,
        borrowInfo: userBorrow,
      };
    }

    // Book status for other users
    if (book.status === "available") {
      return {
        label: "Available",
        className: "bg-green-100 text-green-700",
        buttonText: "BORROW",
        buttonDisabled: false,
      };
    } else if (book.status === "borrowed") {
      return {
        label: "Already borrowed",
        className: "bg-gray-100 text-gray-700",
        buttonText: "BORROW",
        buttonDisabled: true,
      };
    } else {
      return {
        label: "Out of stock",
        className: "bg-red-100 text-red-700",
        buttonText: "BORROW",
        buttonDisabled: true,
      };
    }
  };

  const statusConfig = getStatusConfig();

  const handleButtonClick = () => {
    if (isBorrowedByUser) {
      // Navigate to My Borrows page
      navigate("/my-borrows");
    } else {
      // Open borrow request dialog
      setShowBorrowDialog(true);
    }
  };

  const handleBorrowConfirm = (requestData) => {
    console.log("Borrow request submitted:", requestData);
    // Close the request dialog
    setShowBorrowDialog(false);
    // Show confirmation modal
    setShowConfirmation(true);
    // TODO: Send request to backend
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    // Optionally navigate to My Requests page
    // navigate("/my-requests");
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    console.log("Book deleted:", book.title);
    setShowConfirmDelete(false);
    // TODO: remove from backend
    navigate(-1);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to results */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to results
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Book Cover Section */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[250px] mb-6">
              <img
                src={book.cover_url || "/placeholder-book.png"}
                alt={book.title}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = "/placeholder-book.png";
                }}
              />
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            </div>

            {/* Borrowed Info - Show if user borrowed this book */}
            {isBorrowedByUser && statusConfig.borrowInfo && (
              <div className="mb-4 text-center">
                <p className="text-xs text-gray-600">Borrowed on</p>
                <p className="text-sm font-medium text-gray-800">
                  {statusConfig.borrowInfo.borrowedOn}
                </p>
                <p className="text-xs text-gray-600 mt-2">Return due</p>
                <p className={`text-sm font-medium ${statusConfig.borrowInfo.isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                  {statusConfig.borrowInfo.returnDue}
                </p>
                {statusConfig.borrowInfo.isOverdue && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Overdue</p>
                )}
              </div>
            )}

            {/* Borrow/Action Button */}
            {user?.role === "reader" ? (
              // Reader → Borrow button
              <Button
                onClick={handleBorrowClick}
                disabled={statusConfig.buttonDisabled}
                className="w-full max-w-[200px]"
              >
                {statusConfig.buttonText}
              </Button>
            ) : user?.role === "librarian" ? (
              // Librarian → Edit + Delete buttons
              <div className="flex flex-col gap-3 w-full max-w-[150px] ">
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 rounded-lg  text-sm font-medium bg-[#4A90E2] text-white hover:bg-[#3A7BC8] transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="px-4 py-2 rounded-lg border border-gray-500 text-gray-700 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>

          {/* Book Details Section */}
          <div className="flex flex-col">
            {/* Title and Author */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600">by {book.author}</p>
            </div>

            {/* Overview Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {book.description ||
                  "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."}
              </p>

              {/* Book Metadata Grid */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Pages</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {book.page_count || "240"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Language</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {book.language || "English"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Publisher</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {book.publisher || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ISBN</p>
                  <p className="text-base font-medium text-gray-900">
                    {book.isbn || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-base font-medium text-gray-900">
                    {book.category || "General"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Publication Year</p>
                  <p className="text-base font-medium text-gray-900">
                    {book.publish_year || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Copies</p>
                  <p className="text-base font-medium text-gray-900">
                    {book.available_copies || 0} / {book.total_copies || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Request Dialog */}
      <BorrowRequestDialog
        isOpen={showBorrowDialog}
        onClose={() => setShowBorrowDialog(false)}
        onConfirm={handleBorrowConfirm}
        bookTitle={book.title}
      />

      {/* Confirmation Modal */}
      <BorrowConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
      />

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this book?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
      <BookEditDialog
        isOpen={showEditDialog}
        book={book}
        onSave={(edited) => {
          console.log("Book edited:", edited);
          setShowEditDialog(false);
        }}
        onCancel={() => setShowEditDialog(false)}
      />
    </div>
  );
};

export default BookDetailPage;
