import React, { useState, useEffect } from "react";
import api from "../../services/api";

const BookAddDialog = ({ isOpen, book, onSave, onCancel }) => {
    if (!isOpen) return null;

    const [editedBook, setEditedBook] = useState(book);
    const [preview, setPreview] = useState(book?.cover || "");
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [creatingCategory, setCreatingCategory] = useState(false);


    useEffect(() => {
        setEditedBook(book);
        setPreview(book?.cover || "");
        setErrors({});
        setCreatingCategory(false);
    }, [book]);

    useEffect(() => {
        // load categories for dropdown whenever dialog is opened
        let mounted = true;
        if (!isOpen) return;
        api.get("/categories")
            .then((res) => {
                // Normalize backend response which may be { success, data } or raw array
                const data = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];
                if (mounted) setCategories(data);
            })
            .catch((err) => {
                console.error("Failed to load categories:", err);
            });
        return () => { mounted = false };
    }, [isOpen]);

    useEffect(() => {
        return () => {
            if (preview && typeof preview === 'string' && preview.startsWith && preview.startsWith("blob:")) {
                try {
                    URL.revokeObjectURL(preview);
                } catch (e) {

                }
            }
        };

    }, [preview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedBook((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            if (!prev || !prev[name]) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        if (val === "__new") {
            setCreatingCategory(true);
            setEditedBook((prev) => ({ ...prev, category_id: null, category_name: "" }));
        } else {
            setCreatingCategory(false);
            const id = val === "" ? null : Number(val);
            const cat = categories.find((c) => c.category_id === id);
            setEditedBook((prev) => ({ ...prev, category_id: id, category_name: cat?.category_name || "" }));
        }
        setErrors((prev) => {
            if (!prev || !prev.category_name) return prev;
            const next = { ...prev };
            delete next.category_name;
            return next;
        });
    };

    const handleCoverUrlChange = (e) => {
        const { value } = e.target;
        setPreview(value || "");
        setEditedBook((prev) => ({ ...prev, cover: value || undefined }));
        setErrors((prev) => {
            if (!prev || !prev.cover) return prev;
            const next = { ...prev };
            delete next.cover;
            return next;
        });
    };

    const handleSave = () => {
        // Per-field validation
        const newErrors = {};
        if (!editedBook.title || String(editedBook.title).trim() === "") {
            newErrors.title = 'Title is required.';
        }
        if (!editedBook.author || String(editedBook.author).trim() === "") {
            newErrors.author = 'Author is required.';
        }
        if (!editedBook.isbn || String(editedBook.isbn).trim() === "") {
            newErrors.isbn = 'ISBN is required.';
        }
        // Category required for new books (book.book_id falsy)
        if (!book?.book_id) {
            if ((!editedBook.category_id || editedBook.category_id === null) && (!editedBook.category_name || String(editedBook.category_name).trim() === "")) {
                newErrors.category_name = 'Category is required.';
            }
        }
        // price is required and must be a non-negative number
        if (editedBook.price === undefined || editedBook.price === null || String(editedBook.price).trim() === "") {
            newErrors.price = 'Price is required.';
        } else if (Number.isNaN(Number(editedBook.price)) || Number(editedBook.price) < 0) {
            newErrors.price = 'Price must be a non-negative number.';
        }
        // publish_year is required and must be a non-negative integer
        if (editedBook.publish_year === undefined || editedBook.publish_year === null || String(editedBook.publish_year).trim() === "") {
            newErrors.publish_year = 'Publish year is required.';
        } else if (!Number.isInteger(Number(editedBook.publish_year)) || Number(editedBook.publish_year) < 0) {
            newErrors.publish_year = 'Publish year must be a non-negative integer.';
        }
        // available_stock should be provided (allow zero) and be a non-negative number
        if (editedBook.available_stock === undefined || editedBook.available_stock === null || String(editedBook.available_stock).trim() === "") {
            newErrors.available_stock = 'Available stock is required.';
        } else if (Number.isNaN(Number(editedBook.available_stock)) || Number(editedBook.available_stock) < 0) {
            newErrors.available_stock = 'Available stock must be a non-negative number.';
        }
        // total_stock should be >= available_stock
        if (editedBook.total_stock === undefined || editedBook.total_stock === null || String(editedBook.total_stock).trim() === "") {
            newErrors.total_stock = 'Total stock is required.';
        } else if (Number.isNaN(Number(editedBook.total_stock)) || Number(editedBook.total_stock) < Number(editedBook.available_stock)) {
            newErrors.total_stock = 'Total stock must be a number greater than or equal to available stock.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setErrorMessage('Please fix the errors before saving.');
            return;
        }

        setErrorMessage("");
        const updatedBook = { ...editedBook, cover: preview, book_id: book.book_id };
        onSave(updatedBook);
    };


    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
        >
            <div
                className="bg-white rounded-xl shadow-lg p-10 w-[1000px] max-h-[100vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Book Details
                </h2>


                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="text-sm text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={editedBook.title}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter book title"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={editedBook.author}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter author"
                        />
                        {errors.author && (
                            <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Publisher</label>
                        <input
                            type="text"
                            name="publisher"
                            value={editedBook.publisher || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter publisher"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Publish Year</label>
                        <input
                            type="number"
                            name="publish_year"
                            value={editedBook.publish_year}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter publish year"
                        />
                        {errors.publish_year && (
                            <p className="text-red-500 text-sm mt-1">{errors.publish_year}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={editedBook.price || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter price"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">ISBN</label>
                        <input
                            type="text"
                            name="isbn"
                            value={editedBook.isbn}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter book's ISBN"
                        />
                        {errors.isbn && (
                            <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Number of Stock</label>
                        <input
                            type="number"
                            name="total_stock"
                            value={editedBook.total_stock || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter total stock"
                        />
                        {errors.total_stock && (
                            <p className="text-red-500 text-sm mt-1">{errors.total_stock}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Available Stock</label>
                        <input
                            type="number"
                            name="available_stock"
                            value={editedBook.available_stock || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter available stock"
                        />
                        {errors.available_stock && (
                            <p className="text-red-500 text-sm mt-1">{errors.available_stock}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Category</label>
                        <select
                            name="category_id"
                            value={editedBook.category_id ?? ""}
                            onChange={handleCategoryChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                            ))}

                        </select>
                        {creatingCategory && (
                            <input
                                type="text"
                                name="category_name"
                                value={editedBook.category_name || ""}
                                onChange={handleChange}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Enter new category name"
                            />
                        )}
                        {errors.category_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.category_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Language</label>
                        <select
                            name="language"
                            value={editedBook.language || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">Select</option>
                            <option value="English">English</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="French">French</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Chinese">Chinese</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Book Cover URL</label>
                        <input
                            type="text"
                            name="cover"
                            value={editedBook.cover || preview || ""}
                            onChange={handleCoverUrlChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter image URL"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">

                    <div className="col-span-2">
                        <label className="text-sm text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={editedBook.description || ""}
                            onChange={handleChange}
                            rows={8}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm resize-y"
                            placeholder="Enter book description"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center mt-6 gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-12 py-2 rounded-lg font-medium bg-[#4A90E2] text-white hover:bg-[#3A7BC8] cursor-pointer"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-12 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookAddDialog;
