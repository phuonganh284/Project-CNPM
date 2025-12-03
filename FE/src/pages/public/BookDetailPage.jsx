// src/pages/public/BookDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "../../services/bookService";
import borrowRequestService from "../../services/borrowRequestService";
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
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const data = await getBookById(id);
      setBook(data.book);
    } catch (err) {
      setError("Failed to fetch book details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  // The backend now sends copies sorted by condition, so just take the first available one
  const bestCopy = book?.copies?.find(copy => copy.availability === true);

  const getConditionBadge = (condition) => {
    if (condition >= 80) {
      return { label: 'Excellent', color: 'bg-green-100 text-green-700', icon: '✓' };
    } else if (condition >= 60) {
      return { label: 'Good', color: 'bg-blue-100 text-blue-700', icon: '✓' };
    } else if (condition >= 50) {
      return { label: 'Fair', color: 'bg-yellow-100 text-yellow-700', icon: '!' };
    } else {
      return { label: 'Poor', color: 'bg-red-100 text-red-700', icon: '✕' };
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error || !book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "Book Not Found"}</h2>
          <Button onClick={() => navigate("/browse")}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const getStatusConfig = () => {
    if (book.userHasRequestedOrBorrowed) {
      return {
        label: "You already have this item",
        className: "bg-gray-300 text-gray-800",
        buttonText: "BORROWED",
        buttonDisabled: true,
      };
    }
    if (book.userBorrowCount >= 5) {
      return {
        label: `Borrow Limit Reached (${book.userBorrowCount}/5)`,
        className: "bg-red-100 text-red-700",
        buttonText: "LIMIT REACHED",
        buttonDisabled: true,
      };
    }
    if (book.available_stock <= 0) {
      return {
        label: "Out of stock",
        className: "bg-red-100 text-red-700",
        buttonText: "OUT OF STOCK",
        buttonDisabled: true,
      };
    }
    return {
      label: "Available",
      className: "bg-green-500 text-white",
      buttonText: "BORROW",
      buttonDisabled: false,
    };
  };

  const statusConfig = getStatusConfig();

  const handleButtonClick = () => {
    // Only open the borrow dialog if the book is available for the user to borrow
    if (!statusConfig.buttonDisabled) {
      setShowBorrowDialog(true);
    }
    // If the button is disabled, do nothing. The reason is already displayed on the button itself.
  };

  const handleBorrowConfirm = async (requestData) => {
    try {
      await borrowRequestService.createRequest(requestData);
      setShowBorrowDialog(false);
      setShowConfirmation(true);
      fetchBook(); // Refetch book data to update availability status
    } catch (err) {
      console.error("Failed to create borrow request:", err);
      setError(typeof err === 'string' ? err : "An unexpected error occurred creating the request.");
      setShowBorrowDialog(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
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
    navigate(-1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
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
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[250px] mb-6">
              <img
                src={book.cover || "/placeholder-book.png"}
                alt={book.title}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = "/placeholder-book.png";
                }}
              />
            </div>

            <div className="w-full text-center">
              <div className="mb-4">
                <span
                  className={`inline-block px-6 py-2 rounded-full text-sm font-semibold ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
              </div>

              {user?.role === "reader" && (
                <Button
                  onClick={handleButtonClick}
                  disabled={statusConfig.buttonDisabled}
                  className="w-full max-w-[200px]"
                >
                  {statusConfig.buttonText}
                </Button>
              )}

              {user?.role === "librarian" && (
                <div className="flex flex-col gap-3 w-full max-w-[150px] mx-auto">
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#4A90E2] text-white hover:bg-[#3A7BC8] transition cursor-pointer"
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
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600">by {book.author}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {book.description ||
                  "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."}
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Pages</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {book.pageCount || "240"}
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
                    {book.category?.category_name || "General"}
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
                    {book.available_stock || 0} / {book.total_stock || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BorrowRequestDialog
          isOpen={showBorrowDialog}
          onClose={() => setShowBorrowDialog(false)}
          onConfirm={handleBorrowConfirm}
          book={book}
          copy={bestCopy}
        />

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
    </div>
  );
};

export default BookDetailPage;