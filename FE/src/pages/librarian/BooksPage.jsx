import React, { useState, useEffect } from "react";
import BookCatalogCard from "../../components/BookCatalogCard";
import CategoryTab from "./CategoryTab";
import BookAddDialog from "../../components/dialogs/BookAddDialog";
import ImportCSVDialog from "../../components/dialogs/ImportCSVDialog";
import {
  getBooksAdmin,
  createBookAdmin,
  updateBookAdmin,
  deleteBookAdmin
} from '../../services/bookAdminService';

const BookCatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [activeTab, setActiveTab] = useState("books");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importProgress, setImportProgress] = useState({ done: 0, total: 0, errors: [] });

  const [newBook, setNewBook] = useState({
    book_id: "",
    isbn: "",
    cover: "",
    title: "",
    author: "",
    language: "",
    publisher: "",
    publish_year: "",
    description: "",
    price: "",
    total_stock: "",
    available_stock: "",
    category_name: "",
  });

  // --- Fetch books safely ---
  const loadBooks = async () => {
    setLoading(true);
    setError(""); // reset previous errors
    try {
      const data = await getBooksAdmin();
      if (!Array.isArray(data)) throw new Error("Invalid response from server");
      const normalized = data.map(b => ({ ...b, book_id: b.book_id || b.id }));
      setBooks(normalized);
    } catch (err) {
      console.error(err);
      setError("Failed to load books from server");
      setBooks([]); // clear books on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // --- Handlers ---
  const handleEdit = async (book) => {
    try {
      const updated = await updateBookAdmin(book.book_id, book);
      setBooks(prev => prev.map(b => b.book_id === book.book_id ? updated : b));
      setSuccessMessage("Book updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to update book");
    }
  };

  const handleDelete = async (book) => {
    try {
      await deleteBookAdmin(book.book_id);
      setBooks(prev => prev.filter(b => b.book_id !== book.book_id));
      setSuccessMessage("Book deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete book");
    }
  };

  const handleAddBookSave = async (book) => {
    try {
      const created = await createBookAdmin(book);
      setBooks(prev => [...prev, created]);
      setIsAddDialogOpen(false);
      setSuccessMessage("Book added successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to add book");
    }
  };

  // --- CSV Import Handler ---
  const mapRowToBook = (row) => {
    // Map CSV columns to API fields. CSV headers in your screenshot: title, author, publisher, publish_year, isbn, category, language, description, cover, price, total_stock, available_stock
    return {
      title: row.title || row.bookTitle || row.book_title || '',
      author: row.author || '',
      publisher: row.publisher || '',
      publish_year: row.publish_year || row.publishYear || row.publish_year || '',
      isbn: row.isbn || '',
      category_name: row.category || row.category_name || '',
      language: row.language || '',
      description: row.description || '',
      cover: row.cover && row.cover.trim() !== '' ? row.cover.trim() : undefined,
      price: row.price ? Number(row.price) : undefined,
      total_stock: row.total_stock ? Number(row.total_stock) : (row.totalStock ? Number(row.totalStock) : undefined),
      available_stock: row.available_stock ? Number(row.available_stock) : (row.availableStock ? Number(row.availableStock) : undefined),
    };
  };

  const handleImportUpload = async (parsedData) => {
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      setError('No rows found in CSV');
      return;
    }
    setIsImportOpen(false);
    setLoading(true);
    setImportProgress({ done: 0, total: parsedData.length, errors: [] });

    const CHUNK = 6; // parallel requests per batch
    const rows = parsedData.slice();
    const results = [];
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      try {
        const promises = chunk.map(r => {
          const payload = mapRowToBook(r);
          return createBookAdmin(payload).then(res => ({ ok: true, res })).catch(err => ({ ok: false, err }));
        });
        const settled = await Promise.all(promises);
        settled.forEach(s => {
          if (s.ok && s.res) {
            results.push(s.res);
          } else {
            setImportProgress(prev => ({ ...prev, errors: [...prev.errors, s.err?.toString() || 'Unknown error'] }));
          }
        });
      } catch (bulkErr) {
        console.error('Chunk upload failed', bulkErr);
        setImportProgress(prev => ({ ...prev, errors: [...prev.errors, bulkErr.toString()] }));
      }
      setImportProgress(prev => ({ ...prev, done: Math.min(prev.total, prev.done + chunk.length) }));
    }

    // merge newly created into books list
    if (results.length > 0) {
      setBooks(prev => [...prev, ...results]);
      setSuccessMessage(`Imported ${results.length} books successfully`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }

    setLoading(false);
  };

  // --- Render ---
  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <div className="grid-col gap-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("books")}
              className={`text-lg font-semibold cursor-pointer ${activeTab === "books" ? "text-[#4A90E2] border-b-2 border-blue-500" : "text-gray-600"}`}
            >
              Books
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`text-lg font-semibold cursor-pointer ${activeTab === "categories" ? "text-[#4A90E2] border-b-2 border-blue-500" : "text-gray-600"}`}
            >
              Categories
            </button>
          </div>
          {activeTab === "books" && (
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="px-7 py-2 bg-[#6476A6] text-white rounded-lg hover:bg-[#A5B6CE] cursor-pointer"
              >
                Add Book +
              </button>
              <button
                onClick={() => setIsImportOpen(true)}
                className="px-7 py-2 bg-white text-gray-600 rounded-lg border border-gray-400 hover:bg-gray-100 shadow-sm cursor-pointer"
              >
                Import File
              </button>

            </div>
          )}
        </div>
      </div>

      {loading && <div className="p-6">Loading...</div>}
      {error && <div className="p-6 text-red-500">{error}</div>}
      {successMessage && <div className="mt-4 text-green-600">{successMessage}</div>}
      {!loading && !error && activeTab === "books" && (
        <div>
          <div className="sticky top-0 z-10 bg-[#F3F3F7] py-3 mb-4">
            <div className="flex items-center px-6 gap-4 text-gray-600 font-inter text-sm font-medium max-w-[1200px]">
              <div className="w-[70px] flex-shrink-0 mr-2"></div>
              <div className="flex-1 min-w-0 max-w-[290px] mr-16">Title</div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-[120px] flex-shrink-0 mr-14">Category</div>
                <div className="w-[80px] flex-shrink-0 mr-12">Stock</div>
                <div className="w-[120px] flex-shrink-0 mr-6">Status</div>
                <div className="w-[100px] flex-shrink-0">Action</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {books.length === 0 ? (
              <p className="text-gray-500">No books available.</p>
            ) : (
              books.map(book => (
                <BookCatalogCard
                  key={book.book_id}
                  {...book}
                  status={book.available_stock > 0 ? "Available" : "Out of Stock"}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(book)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {!loading && !error && activeTab === "categories" && <CategoryTab />}

      <BookAddDialog
        isOpen={isAddDialogOpen}
        book={newBook}
        onSave={handleAddBookSave}
        onCancel={() => setIsAddDialogOpen(false)}
      />

      <ImportCSVDialog
        isOpen={isImportOpen}
        onUpload={handleImportUpload}
        onCancel={() => setIsImportOpen(false)}
      />


      {importProgress.total > 0 && (
        <div className="mt-4 text-sm text-gray-700">
          Import progress: {importProgress.done}/{importProgress.total}
          {importProgress.errors.length > 0 && (
            <div className="text-red-600 mt-1">Errors: {importProgress.errors.length} (check console)</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCatalogPage;
