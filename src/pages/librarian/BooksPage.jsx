import React, { useState } from "react";
import { mockBooks } from "../../data/mockBooks";
import BookCatalogCard from "../../components/BookCatalogCard";

const BookCatalogPage = () => {
  const [books, setBooks] = useState(mockBooks);

  const handleEdit = (book) => {
    console.log("Edit clicked for:", book.title);
  };

  const handleDelete = (book) => {
    console.log("Delete clicked for:", book.title);
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Manage Book Catalog
      </h2>

      {/* Table Header - Sticky */}
      <div className="sticky top-0 z-10 bg-[#F3F3F7] py-3 mb-4">
        <div className="flex items-center px-6 gap-4 text-gray-600 font-inter text-sm font-medium max-w-[1200px]">
          {/* Book Cover Space */}
          <div className="w-[70px] flex-shrink-0 mr-2"></div>

          {/* Headers */}
          <div className="flex-1 min-w-0 max-w-[290px] mr-2">Title</div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-[120px] flex-shrink-0 mr-26">Category</div>
            <div className="w-[80px] flex-shrink-0 mr-12">Stock</div>
            <div className="w-[120px] flex-shrink-0 mr-6">Status</div>
            <div className="w-[100px] flex-shrink-0">Action</div>
          </div>
        </div>
      </div>

      {/* Book Cards */}
      <div className="flex flex-col gap-4">

        {books.map((book) => (
          <BookCatalogCard
            key={book.id}
            bookCover={book.cover_url}
            bookTitle={book.title}
            bookAuthor={book.author}
            bookYear={book.publish_year}
            publisher={book.publisher}
            category={book.category}
            isbn={book.isbn}
            page_count={book.page_count}
            total_copies={book.total_copies}
            available_copies={book.available_copies}
            language={book.language}
            description={book.description}
            status={book.available_copies > 0 ? 'Available' : 'Out of Stock'}
            onEdit={() => handleEdit(book)}
            onDelete={() => handleDelete(book)}
            onClick={() => console.log("Clicked on", book.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookCatalogPage;
