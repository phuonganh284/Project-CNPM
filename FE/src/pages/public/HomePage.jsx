import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IntroBox from '../../components/IntroBox';
import AvailableNow from '../../components/AvailableNow';
import BookCard from '../../components/BookCard';
import { getBooks } from '../../services/bookService';

const HomePage = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Fetch books with personalized sorting based on user's borrowing history
                // Backend sorts books by preferred categories (most borrowed categories first)
                // For guests, books are sorted by availability and popularity
                const data = await getBooks();
                setBooks(data.books);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch books.');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const availableBooks = books.filter(book => book.available_stock > 0);
    const recommendedBooks = books; // The backend now sends recommended books first

    // Calculate how many books fit in one row (card width 160px + gap 20px)
    // Approximate available width: container width - padding
    // Show max 7 books (safe number for most screens)
    const booksToShow = recommendedBooks.slice(0, 7);

    // Dynamic greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        if (hour >= 17 && hour < 21) return 'Good Evening';
        return 'Good Night';
    };

    const handleShowAll = () => {
        navigate('/browse');
    };

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-[#F3F3F7] min-h-screen pb-10 -m-4">
            {/* Responsive Hero Section */}
            <div className="flex flex-col lg:flex-row gap-8 pt-4 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex-shrink-0 w-full lg:w-auto">
                    <IntroBox />
                </div>
                <div className="flex-grow mt-4 w-full">
                    <AvailableNow
                        books={availableBooks}
                    />
                </div>
            </div>

            {/* Greeting Section */}
            <div className="px-4 md:px-8 max-w-7xl mx-auto mt-12">
                <h1 className="text-gray-800 font-inter text-3xl font-bold mb-2">
                    {getGreeting()}
                </h1>
            </div>

            {/* Recommended for You */}
            <div className="px-4 md:px-8 max-w-7xl mx-auto mt-6">
                <div className="flex items-center justify-between mb-8 ">
                    <h2 className="text-gray-700 font-inter text-xl font-semibold">
                        Recommended for You
                    </h2>
                    <button
                        onClick={handleShowAll}
                        className="text-[#4A90E2] font-inter text-sm font-medium hover:underline cursor-pointer"
                    >
                        Show All
                    </button>
                </div>

                {/* Responsive Book Card Grid - wraps on smaller screens */}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    {booksToShow.map(book => (
                        <BookCard
                            key={book.book_id}
                            book={book}
                            variant="grid"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;