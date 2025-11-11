import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import BookEditDialog from "../../components/dialogs/BookEditDialog";

const BookCopiesPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [copies, setCopies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newCopiesCount, setNewCopiesCount] = useState(1);

    useEffect(() => {
        loadCopies();
    }, [bookId]);

    const loadCopies = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/copies/${bookId}`);
            console.log("Response from backend:", res.data);

            // Handle both possible shapes
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            setCopies(data || []);
        } catch (err) {
            setError("Failed to load copies");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (copyId) => {
        if (!window.confirm("Delete this copy?")) return;
        try {
            await api.delete(`/copies/${copyId}`);
            setCopies((prev) => prev.filter((c) => c.copy_id !== copyId));
        } catch (err) {
            alert("Failed to delete copy");
            console.error(err);
        }
    };

    const handleAddCopies = async () => {
        try {
            for (let i = 0; i < newCopiesCount; i++) {
                await api.post(`/copies/book/${bookId}`, { book_id: Number(bookId) });
            }
            await loadCopies();
            setNewCopiesCount(1);
        } catch (err) {
            alert("Failed to add copies");
            console.error(err);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading copies...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="p-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 rounded hover:underline cursor-pointer"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-semibold mb-6">Book Copies</h1>

            <div className="mb-6 flex items-center gap-3">
                <input
                    type="number"
                    value={newCopiesCount}
                    onChange={(e) => setNewCopiesCount(Math.max(1, Number(e.target.value)))}
                    className="border border-gray-200 rounded p-2 w-20 bg-white shadow-sm"
                    min="1"
                />
                <button
                    onClick={handleAddCopies}
                    className="px-7 py-2 bg-[#6476A6] text-white rounded-lg hover:bg-[#A5B6CE] cursor-pointer"
                >
                    Add Copies
                </button>
            </div>

            {copies.length === 0 ? (
                <p>No copies found.</p>
            ) : (
                <table className="w-full border border-gray-300 rounded bg-white rounded shadow-sm">
                    <thead>
                        <tr className="bg-[#4A90E2] text-white  text-sm font-medium ">
                            <th className="p-2 border ">Copy ID</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Condition</th>
                            <th className="p-2 border">Borrowed</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {copies.map((copy) => (
                            <tr key={copy.copy_id}>
                                <td className="p-2 border border-gray-400 text-center text-sm">{copy.copy_id}</td>
                                <td className="p-2 border border-gray-400 text-center text-sm">{copy.status}</td>
                                <td className="p-2 border border-gray-400 text-center text-sm">{copy.condition}</td>
                                <td className="p-2 border border-gray-400 text-center text-sm">
                                    {copy.borrowed ? "Yes" : "No"}
                                </td>
                                <td className="p-2 border text-center">
                                    <button
                                        onClick={() => handleDelete(copy.copy_id)}
                                        disabled={copy.borrowed} // disable if borrowed
                                        className={`text-sm ${copy.borrowed ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:underline cursor-pointer"
                                            }`}
                                        title={copy.borrowed ? "Cannot delete a borrowed copy" : "Delete copy"}
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookCopiesPage;
