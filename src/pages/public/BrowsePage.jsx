import React from 'react';
import BookCard from '../../components/BookCard';
import { mockBooks } from '../../data/mockBooks';

const BrowsePage = () => {
    const handleBookClick = (book) => {
        console.log('Book clicked:', book);
        // TODO: Navigate to book detail page or open modal
    };

    return (
        <div className="bg-[#F3F3F7] min-h-screen pb-10 -m-4 p-4">
            <div className="mb-6">
                <h1 className="text-gray-800 font-inter text-3xl font-bold mb-2">
                    Browse Books
                </h1>
                <p className="text-gray-600 font-inter text-sm">
                    Explore our collection of {mockBooks.length} books
                </p>
            </div>

            {/* All Books Grid */}
            <div className="flex flex-wrap gap-5">
                {mockBooks.map(book => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onClick={handleBookClick}
                        variant="grid"
                    />
                ))}
            </div>
        </div>
    );
};

export default BrowsePage;