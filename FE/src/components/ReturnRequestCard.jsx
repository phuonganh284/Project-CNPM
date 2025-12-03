import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Card component specifically for Return Request page
 * Size: max-w-full×125px (responsive)
 * Left: Book cover + info (title, author, year)
 * Right: User, Status, Charge Total, Action buttons
 */
const ReturnRequestCard = ({
    bookId,
    bookCover,
    bookTitle,
    bookAuthor,
    bookYear,
    userName,
    rightContent, // Flexible section: status, charge, buttons, etc.
    onClick
}) => {
    const navigate = useNavigate();

    const handleCoverClick = (e) => {
        e.stopPropagation();
        if (bookId) {
            navigate(`/book/${bookId}`);
        }
    };

    return (
        <div
            className="
                 h-[125px]
                bg-white 
                rounded-2xl 
                border border-gray-200
                flex items-center
                px-5 gap-4
                hover:shadow-md
                transition-shadow
            "
            onClick={onClick}
        >
            {/* Book Cover */}
            <img
                src={bookCover}
                alt={bookTitle}
                className="w-[70px] h-[99px] object-cover rounded-lg shadow-sm flex-shrink-0 cursor-pointer"
                onClick={handleCoverClick}
                onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = 'https://placehold.co/70x99/EEE/313131?text=No+Cover'; 
                }} 
            />

            {/* Book Info */}
            <div className="w-[190px] flex-shrink-0" >
                <h3 className="font-inter text-base font-semibold text-gray-800 mb-1 truncate">
                    {bookTitle}
                </h3>
                <p className="font-inter text-sm text-gray-600 truncate">
                    {bookAuthor}, {bookYear}
                </p>
            </div>

            {/* User */}
            <div className="w-[100px] flex-shrink-0 ml-[5px]">
                <p className="font-inter text-sm font-medium text-gray-800 truncate">
                    {userName}
                </p>
            </div>

            {/* Right Content - Flexible */}
            <div className="flex items-center gap-4 flex-shrink-0">
                {rightContent}
            </div>
        </div>
    );
};

export default ReturnRequestCard;
