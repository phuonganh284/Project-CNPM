import React, { useState, useEffect } from "react";

const BookEditDialog = ({ isOpen, book, onSave, onCancel }) => {
    if (!isOpen) return null;

    const [editedBook, setEditedBook] = useState(book); // edit book
    const [errorMessage, setErrorMessage] = useState("");

    const [preview, setPreview] = useState(book?.bookCover || ""); // set data tạm thời
    const [bookData, setBookData] = useState(book);


    useEffect(() => {
        setEditedBook(book);
        setPreview(book?.bookCover || "");
    }, [book]);

    useEffect(() => {

        return () => {
            if (preview && preview.startsWith?.("blob:")) {
                try {
                    URL.revokeObjectURL(preview);
                } catch (e) {

                }
            }
        };

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreview(imageURL);
            setEditedBook((prev) => ({
                ...prev,
                cover_url: imageURL,
                coverFile: file, // keep actual file if needed for upload (TODO BE)
            }));
        }
    };

    const handleSave = () => {
        const updatedBook = { ...editedBook, bookCover: preview };
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
                            name="bookTitle"
                            value={editedBook.bookTitle}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter book title"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Author</label>
                        <input
                            type="text"
                            name="bookAuthor"
                            value={editedBook.bookAuthor}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter author"
                        />
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
                            name="bookYear"
                            value={editedBook.bookYear}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter publish year"
                        />
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
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Page Number</label>
                        <input
                            type="number"
                            name="page_count"
                            value={editedBook.page_count || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter page number"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Number of Copies</label>
                        <input
                            type="number"
                            name="total_copies"
                            value={editedBook.total_copies || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter total copies"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Available Copies</label>
                        <input
                            type="number"
                            name="available_copies"
                            value={editedBook.available_copies || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter available copies"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={editedBook.category || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter category"
                        />
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

                    <div className="flex flex-col mb-1 items-center gap-2">
                        <label className="text-sm text-gray-700">Book Cover</label>
                        <img
                            src={preview || "https://via.placeholder.com/120x160?text=No+Cover"}
                            alt="No cover"
                            className="w-32 h-40 object-cover rounded-lg border border-gray-300"
                        />
                        <label
                            htmlFor="coverUpload"
                            className="text-sm text-[#4A90E2] cursor-pointer hover:underline"
                        >
                            Upload picture
                        </label>
                        <input
                            id="coverUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                    </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-center mt-6 gap-3">
                    <button
                        onClick={handleSave}
                        className="px-12 py-2 rounded-lg font-medium bg-[#4A90E2] text-white hover:bg-[#3A7BC8] cursor-pointer"
                    >
                        Save
                    </button>
                    <button
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

export default BookEditDialog;
