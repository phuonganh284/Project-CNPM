import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBooks } from '../../services/bookService';
import BorrowRequestDialog from '../../components/dialogs/BorrowRequestDialog';

const BrowsePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Import useLocation
    const { debouncedSearchTerm, filter } = useOutletContext();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams(location.search);
                const urlSearchTerm = queryParams.get('q');
                const urlFilter = queryParams.get('filter');

                // Prioritize URL parameters, otherwise use context values
                const currentSearchTerm = urlSearchTerm !== null ? urlSearchTerm : debouncedSearchTerm;
                const currentFilter = urlFilter !== null ? urlFilter : filter;

                const data = await getBooks(currentSearchTerm, currentFilter);
                setBooks(data.books);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch books.');
                setLoading(false);
            }
        };

        fetchBooks();
    }, [debouncedSearchTerm, filter, location.search]); // Add location.search to dependencies

    // Get unique categories from books
    const categories = ["All", ...new Set(books.map(book => book.category.category_name).filter(Boolean))];

    // Filter books by category
    const filteredBooks = categoryFilter === "All"
        ? books
        : books.filter(book => book.category.category_name === categoryFilter);

    // Check if user is logged in (reader or librarian)
    const isAuthenticated = user && user.role !== 'guest';

    const getStatusBadge = (book) => {
        if (book.available_stock === 0) {
            return (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                    Out-of-stock
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded">
                Available
            </span>
        );
    };

    const handlePreview = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleBorrowRequest = (book) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setSelectedBook(book);
        setIsBorrowDialogOpen(true);
    };

    return (
        <div className="bg-[#F3F3F7] min-h-screen pb-10 -m-4 p-4">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-gray-800 font-inter text-3xl font-bold mb-2">
                        Browse {isAuthenticated ? '' : '- Guest view'}
                    </h1>
                </div>

                <div className="flex justify-between items-center mb-6">
                    {/* Category Dropdown */}
                    <div className="relative inline-block">
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[160px]"
                        >
                            <span className="text-gray-700 font-medium">{categoryFilter}</span>
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isCategoryOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setCategoryFilter(category);
                                            setIsCategoryOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                {/* Books Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
                        <div className="col-span-5">Title</div>
                        <div className="col-span-3">Category</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2"></div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : error ? (
                        <div className="text-center p-10 text-red-500">{error}</div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredBooks.map((book) => (
                                <div
                                    key={book.book_id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                                >
                                    {/* Title Column */}
                                    <div className="col-span-5 flex items-center gap-4">
                                        <img
                                            src={book.cover}
                                            alt={book.title}
                                            className="w-12 h-16 object-cover rounded shadow-sm"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/48x64?text=No+Cover';
                                            }}
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-0.5">
                                                {book.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {book.author}, {book.publish_year}
                                            </p>
                                            {book.publisher && (
                                                <p className="text-xs text-gray-400">
                                                    {book.publisher}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category Column */}
                                    <div className="col-span-3">
                                        <p className="text-gray-700">{book.category.category_name}</p>
                                        <p className="text-sm text-gray-500">{book.language || 'UX Design'}</p>
                                    </div>

                                    {/* Status Column */}
                                    <div className="col-span-2">
                                        {getStatusBadge(book)}
                                    </div>

                                    {/* Action Column */}
                                    <div className="col-span-2 flex justify-end">
                                        <button
                                            onClick={() => handlePreview(book.book_id)}
                                            className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Borrow Request Dialog */}
            {selectedBook && (
                <BorrowRequestDialog
                    isOpen={isBorrowDialogOpen}
                    onClose={() => {
                        setIsBorrowDialogOpen(false);
                        setSelectedBook(null);
                    }}
                    book={selectedBook}
                />
            )}
        </div>
    );
};

export default BrowsePage;