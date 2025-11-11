import React, { useEffect, useState } from "react";
import api from "../../api/api";

const CategoryTab = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load categories");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            const res = await api.post("/categories", { category_name: newCategory });
            if (res.success) {
                setCategories((prev) => [...prev, res.data]);
                setNewCategory("");
                setSuccess("Category added successfully");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to add category");
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/categories/${id}`);
            if (res.success) {
                setCategories((prev) => prev.filter((cat) => cat.category_id !== id));
                setSuccess("Category deleted successfully");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError("Failed to delete category");
            }
        } catch (err) {
            console.error(err);
            setError("Error deleting category");
        }
    };

    return (
        <div className="p-4 rounded-lg ">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Manage Categories</h3>

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 flex-1 bg-white shadow-sm"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-[#6476A6] text-white px-6 py-2 rounded-lg hover:bg-[#A5B6CE] cursor-pointer"
                >
                    Add Category
                </button>
            </div>

            {success && <p className="text-green-600 mb-3">{success}</p>}
            {error && <p className="text-red-600 mb-3">{error}</p>}

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                {categories.length === 0 ? (
                    <p className="text-gray-500">No categories found.</p>
                ) : (
                    <ul className="divide-y">
                        {categories.map((cat) => (
                            <li
                                key={cat.category_id}
                                className="flex justify-between items-center py-2"
                            >
                                <span>{cat.category_name}</span>
                                <button
                                    onClick={() => handleDelete(cat.category_id)}
                                    className="text-red-500 hover:underline cursor-pointer"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CategoryTab;
