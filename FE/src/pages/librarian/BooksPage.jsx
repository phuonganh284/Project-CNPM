import React, { useState, useEffect } from "react";
import BookCatalogCard from "../../components/BookCatalogCard";
import CategoryTab from "./CategoryTab";
import BookAddDialog from "../../components/dialogs/BookAddDialog";
import ImportCSVDialog from "../../components/dialogs/ImportCSVDialog";
import api from "../../api/api";

const BookCatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [activeTab, setActiveTab] = useState("books");

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
    availability_status: "",
    available_stock: "",
    category_name: "",
  });

  // --- Fetch books from backend ---
  useEffect(() => {
    setLoading(true);
    api.get("/books")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.books || [];
        const normalized = data.map(b => ({ ...b, book_id: b.book_id || b.id }));
        setBooks(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load books from server");
        setLoading(false);
      });
  }, []);


  // --- Handlers ---
  const handleEdit = async (book) => {
    try {
      const res = await api.put(`/books/${book.book_id}`, book);
      const updated = res?.data || res;
      setBooks((prev) =>
        prev.map((b) => (b.book_id === book.book_id ? updated : b))
      );
      setSuccessMessage("Book updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to update book");
    }
  };

  const handleDelete = async (book) => {
    console.log("Deleting book id:", book.book_id);
    try {
      const result = await api.delete(`/books/${parseInt(book.book_id)}`);
      console.log("Delete result:", result);

      if (result && result.success) {
        setBooks((prev) => prev.filter((b) => b.book_id !== book.book_id));
        setSuccessMessage("Book deleted successfully!");
      } else {
        setError(result?.message || "Failed to delete book");
      }
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete book");
    }
  };

  const handleAddBookSave = async (book) => {
    try {
      const res = await api.post("/books", book);
      const created = res?.data || res;
      setBooks((prev) => [...prev, created]);
      setIsAddDialogOpen(false);
      setSuccessMessage("Book added successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add book");
    }
  };

  // For CSV import
  const handleUpload = (data) => {
    (async () => {
      const rows = Array.isArray(data) ? data : [];
      if (rows.length === 0) {
        setError('No rows to import');
        return;
      }

      const createdBooks = [];
      const failures = [];

      const getField = (row, names) => {
        for (const n of names) {
          if (n in row && row[n] !== undefined && row[n] !== null && String(row[n]).trim() !== '') return String(row[n]).trim();
        }
        // case-insensitive
        const lowerMap = Object.keys(row).reduce((acc, k) => { acc[k.trim().toLowerCase()] = k; return acc; }, {});
        for (const n of names) {
          const lk = n.trim().toLowerCase();
          if (lk in lowerMap) return String(row[lowerMap[lk]]).trim();
        }
        return '';
      };

      for (const [i, row] of rows.entries()) {
        const payload = {
          title: getField(row, ['title', 'Title']),
          isbn: getField(row, ['isbn', 'ISBN', 'Isbn']),
          author: getField(row, ['author', 'Author']),
          publisher: getField(row, ['publisher', 'Publisher']),
          publish_year: (getField(row, ['publish_year', 'publish year', 'Publish_Year', 'Publish Year']) || '') === '' ? null : Number(getField(row, ['publish_year', 'publish year', 'Publish_Year', 'Publish Year'])),
          description: getField(row, ['description', 'Description']),
          cover: getField(row, ['cover', 'Cover', 'image', 'image_url', 'imageURL']),
          language: getField(row, ['language', 'Language']),
          price: getField(row, ['price', 'Price']) === '' ? 0 : Number(getField(row, ['price', 'Price'])),
          total_stock: getField(row, ['total_stock', 'Total_Stock', 'total stock', 'Total Stock']) === '' ? 0 : Number(getField(row, ['total_stock', 'Total_Stock', 'total stock', 'Total Stock'])),
          available_stock: getField(row, ['available_stock', 'Available_Stock', 'available stock', 'Available Stock']) === '' ? null : Number(getField(row, ['available_stock', 'Available_Stock', 'available stock', 'Available Stock'])),
          // allow category_name to be used by backend to find/create category
          category_name: getField(row, ['category_name', 'Category', 'category'])
        };

        // require title and category_name 
        if (!payload.title) {
          failures.push({ row: i + 1, error: 'Missing title' });
          continue;
        }

        try {
          const res = await api.post('/books', payload);
          const created = res?.data || res;
          createdBooks.push(created);
        } catch (err) {
          failures.push({ row: i + 1, error: err.message || String(err) });
        }
      }

      // update UI
      if (createdBooks.length > 0) {
        setBooks((prev) => [...prev, ...createdBooks]);
      }

      setIsImportOpen(false);

      if (failures.length === 0) {
        setSuccessMessage(`Imported ${createdBooks.length} books successfully.`);
        setTimeout(() => setSuccessMessage(''), 6000);
      } else {
        setError(`Imported ${createdBooks.length} books; ${failures.length} failed. First error: ${failures[0].error}`);
      }
    })();
  };

  // --- Render ---
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // MAIN ------------------------------------------------------------------------------------------------
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

      {/* Display section */}
      {activeTab === "books" ? (
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
            {books.map((book) => (
              <BookCatalogCard
                key={book.book_id}
                {...book}
                status={book.available_stock > 0 ? "Available" : "Out of Stock"}
                onEdit={(edited) => handleEdit(edited)}
                onDelete={() => handleDelete(book)}
                onClick={() => console.log("Clicked on", book.title)}
              />
            ))}
          </div>
        </div>
      ) : (
        <CategoryTab />
      )}

      {/* Add Book Dialog */}
      <BookAddDialog
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
