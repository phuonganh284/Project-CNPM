import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onClick, variant = 'carousel' }) => {
    // variant: 'carousel' (Available Now - only cover) | 'grid' (Recommended - with text)
    
    if (variant === 'carousel') {
        // Available Now / New Arrivals card - 167x203px
        return (
            <Link to={`/book/${book.id}`}>
                <div
                    className="
                        flex-shrink-0
                        w-[167px]
                        h-[203px]
                        cursor-pointer
                        transition-transform
                        hover:scale-105
                        duration-200
                        flex
                        items-center
                        justify-center
                        bg-white
                        rounded-lg
                        shadow-sm
                    "
                >
                    <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-[123px] h-[170px] object-cover rounded-md"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/123x170?text=No+Cover';
                        }}
                    />
                </div>
            </Link>
        );
    }

    // Grid variant - 160x260px with title, author, year INSIDE white card
    return (
        <Link to={`/book/${book.id}`}>
            <div
                className="
                    w-[160px]
                    bg-white
                    rounded-lg
                    shadow-md
                    overflow-hidden
                    cursor-pointer
                    transition-transform
                    hover:scale-105
                    duration-200
                    pb-3
                "
            >
                {/* Book Cover - 123x170px */}
                <div className="
                    w-full
                    h-[170px]
                    flex
                    items-center
                    justify-center
                    bg-gray-50
                ">
                    <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-[123px] h-[170px] object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/123x170?text=No+Cover';
                        }}
                    />
                </div>

                {/* Book Info - Inside white card */}
                <div className="px-3 pt-3">
                    <h3 className="
                        text-gray-800
                        font-inter
                        text-sm
                        font-semibold
                        mb-1
                        leading-tight
                        overflow-hidden
                        text-ellipsis
                    "
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.5em'
                    }}
                    >
                        {book.title}
                    </h3>
                    <p className="
                        text-gray-500
                        font-inter
                        text-xs
                        overflow-hidden
                        text-ellipsis
                        whitespace-nowrap
                    ">
                        {book.author}, {book.publish_year}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;
