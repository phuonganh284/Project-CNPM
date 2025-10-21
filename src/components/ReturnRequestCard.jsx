import React from 'react';

/**
 * Card component specifically for Return Request page
 * Size: max-w-full×125px (responsive)
 * Left: Book cover + info (title, author, year)
 * Right: User, Status, Charge Total, Action buttons
 */
const ReturnRequestCard = ({ 
    bookCover, 
    bookTitle, 
    bookAuthor, 
    bookYear,
    userName,
    rightContent, // Flexible section: status, charge, buttons, etc.
    onClick 
}) => {
    return (
        <div 
            className="
                w-full max-w-[1200px] h-[125px]
                bg-white 
                rounded-2xl 
                shadow-sm
                border border-gray-200
                flex items-center
                px-6
                gap-4
                hover:shadow-md
                transition-shadow
                cursor-pointer
            "
            onClick={onClick}
        >
            {/* Book Cover */}
            <img 
                src={bookCover} 
                alt={bookTitle}
                className="w-[70px] h-[99px] object-cover rounded-lg shadow-sm flex-shrink-0"
            />

            {/* Book Info */}
            <div className="flex-1 min-w-0 max-w-[300px]">
                <h3 className="font-inter text-base font-semibold text-gray-800 mb-1 truncate">
                    {bookTitle}
                </h3>
                <p className="font-inter text-sm text-gray-600 truncate">
                    {bookAuthor}, {bookYear}
                </p>
            </div>

            {/* User */}
            <div className="w-[100px] flex-shrink-0">
                <p className="font-inter text-sm font-medium text-gray-800 truncate">
                    {userName}
                </p>
            </div>

            {/* Right Content - Flexible */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {rightContent}
            </div>
        </div>
    );
};

export default ReturnRequestCard;
