import React, { useState } from "react";
import { mockBooks } from "../../data/mockBooks";
import BookCatalogCard from "../../components/BookCatalogCard";
import BookEditDialog from "../../components/dialogs/BookEditDialog";
import ImportCSVDialog from "../../components/dialogs/ImportCSVDialog";

const BookCatalogPage = () => {
  const [books, setBooks] = useState(mockBooks);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [newBook, setNewBook] = useState({
    bookTitle: "",
    bookAuthor: "",
    publisher: "",
    bookYear: "",
    isbn: "",
    page_count: "",
    total_copies: "",
    available_copies: "",
    category: "",
    language: "",
    description: "",
  });

  // 4 chức năng: edit, delete, add, import
  const handleEdit = (book) => {
    console.log("Edit clicked for:", book.title);
  };

  const handleDelete = (book) => {
    console.log("Delete clicked for:", book.title);
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
  };

  const handleAddBookSave = (book) => {
    const missingFields = Object.entries(book)
      .filter(([key, value]) => value === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      alert("Please fill in the missing fields.");
      return;
    }
    const newBookEntry = {
      id: Date.now().toString(),
      title: book.bookTitle,
      author: book.bookAuthor,
      publisher: book.publisher,
      publish_year: book.bookYear,
      isbn: book.isbn,
      page_count: book.page_count,
      total_copies: book.total_copies,
      available_copies: book.available_copies,
      category: book.category,
      language: book.language,
      description: book.description,
      cover_url: book.cover_url,
    };

    setBooks((prev) => [...prev, newBookEntry]);
    setIsAddDialogOpen(false);
  };

  const handleUpload = (data) => { // use for import csv file
    console.log("Uploaded data:", data);
    setBooks((prev) => [...prev, ...data]);
    setIsImportOpen(false);
    setSuccessMessage("File imported successfully!");

    // message time out after 6 sec
    setTimeout(() => setSuccessMessage(""), 6000);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col justify-between mb-2">

        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          Manage Book Catalog
        </h2>

        <div className="flex flex-row gap-3 mr-4">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="px-7 py-2 bg-[#6476A6] text-white rounded-lg hover:bg-[#A5B6CE] cursor-pointer "
          >
            Add Book +
          </button>

          <button
            onClick={() => setIsImportOpen(true)}
            className="px-7 py-2 bg-white text-gray-600 rounded-lg border border-gray-400 hover:bg-gray-100 shadow-sm cursor-pointer"
          >
            Import File
          </button>
          {successMessage && (
            <div className="mt-3 text-green-600 font-medium transition-opacity duration-500">
              {successMessage}
            </div>
          )}
        </div>


      </div>

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
        {books.map((book, idx) => (
          <BookCatalogCard
            key={idx}
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
            status={book.available_copies > 0 ? "Available" : "Out of Stock"}
            onEdit={() => handleEdit(book)}
            onDelete={() => handleDelete(book)}
            onClick={() => console.log("Clicked on", book.title)}
          />
        ))}
      </div>

      {/* Add Book Dialog */}
      <BookEditDialog
        isOpen={isAddDialogOpen}
        book={newBook}
        onSave={handleAddBookSave}
        onCancel={() => setIsAddDialogOpen(false)}
      />

      {/* Import CSV Dialog */}
      <ImportCSVDialog
        isOpen={isImportOpen}
        onUpload={handleUpload}
        onCancel={() => setIsImportOpen(false)}
      />
    </div>
  );

};

export default BookCatalogPage;
