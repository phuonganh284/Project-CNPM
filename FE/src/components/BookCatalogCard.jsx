/**
For Manage Books page
 */
import React, { useState } from "react";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import BookEditDialog from "./dialogs/BookEditDialog";

const BookCatalogCard = ({
    book_id,
    isbn,
    cover,
    title,
    author,
    language,
    publisher,
    publish_year,
    description,
    price,
    total_stock,
    available_stock,
    category_name,
    status,

    onEdit,
    onDelete,
    onClick,
}) => {

    const [showConfirm, setShowConfirm] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const isBorrowed = status === "Borrowed";

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (isBorrowed) return;
        setShowConfirm(true);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (isBorrowed) return;
        setShowEditDialog(true);
    };
    const bookData = {
        book_id,
        isbn,
        cover,
        title,
        author,
        language,
        publisher,
        publish_year,
        description,
        price,
        total_stock,
        available_stock,
        category_name,
        status
    };
    return (
        <>
            <div
                className="
                h-[125px] mr-2
                bg-white 
                rounded-2xl 
                border border-gray-200
                flex items-center
                px-6
                hover:shadow-md
                transition-shadow
            "
                onClick={onClick}
            >
                {/* Book Cover */}
                <img
                    src={cover}
                    alt={title}
                    className="w-[70px] h-[99px] object-cover rounded-lg shadow-sm flex-shrink-0 mr-6"
                />

                {/* Book Info */}
                <div className="flex-1 min-w-0 max-w-[290px] mr-20">
                    <h3 className="font-inter text-base font-semibold text-gray-800 mb-1 truncate">
                        {title}
                    </h3>
                    <p className="font-inter text-sm text-gray-600 truncate">
                        {author}, {publish_year}
                    </p>
                </div>

                {/* Category */}
                <div className="w-[200px] flex-shrink-0 ">
                    <p className="font-inter text-base text-gray-800 mb-1 truncate">
                        {category_name}
                    </p>
                </div>

                {/* Stock */}
                <div className="w-[100px] flex-shrink-0 mr-6">
                    <p className="font-inter text-base text-gray-800 mb-1 truncate">
                        {available_stock}
                    </p>
                </div>

                {/* status */}
                <div className="w-[130px] flex-shrink-0 mr-6">
                    {status === 'Available' &&
                        (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Available
                            </span>
                        )}
                    {status === 'Borrowed' &&
                        (
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                Borrowed
                            </span>
                        )}
                    {status === 'Out of Stock' &&
                        (
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Out-of-Stock
                            </span>
                        )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={handleEditClick}
                        disabled={isBorrowed}
                        className={`px-6 py-2 rounded-lg font-inter text-sm font-medium 
                            ${isBorrowed
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#4A90E2] text-white hover:bg-[#3A7BC8] cursor-pointer"}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        disabled={isBorrowed}
                        className={` px-6 py-2 rounded-lg border text-sm font-medium transition-all
                            ${isBorrowed
                                ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                                : "border-gray-500 text-gray-700 hover:bg-gray-50 cursor-pointer"
                            }
                        `}
                    >
                        Delete
                    </button>
                </div>
            </div>


            {/* Dialogs */}
            <ConfirmDialog
                isOpen={showConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this book?"
                onConfirm={() => {
                    setShowConfirm(false);
                    onDelete?.();
                }}
                onCancel={() => setShowConfirm(false)}
            />

            <BookEditDialog
                isOpen={showEditDialog}
                book={bookData}
                onSave={(edited) => {
                    setShowEditDialog(false);
                    onEdit?.(edited);
                }}
                onCancel={() => setShowEditDialog(false)}

            />
        </>

    );
};

export default BookCatalogCard;
