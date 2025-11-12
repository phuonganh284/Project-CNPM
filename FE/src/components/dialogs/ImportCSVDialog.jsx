import React, { useState } from "react";
import Papa from "papaparse";

const ImportCSVDialog = ({ isOpen, onUpload, onCancel }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [parsedData, setParsedData] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            Papa.parse(file,
                {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setParsedData(results.data);
                    },
                });
        }
    };

    const handleUpload = () => {
        if (parsedData) {
            onUpload(parsedData);
            setSelectedFile(null);
            setParsedData(null);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div
                className="bg-white rounded-xl shadow-lg p-8 w-[500px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Import Books from CSV
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                    Please upload a <span className="font-medium text-gray-800">CSV file</span>{" "}
                    with the specified format.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept=".csv"
                        id="fileInput"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="fileInput"
                        className="text-[#4A90E2] font-medium cursor-pointer underline"
                    >
                        Choose CSV File
                    </label>

                    {selectedFile ? (
                        <p className="mt-3 text-sm text-gray-700">{selectedFile.name}</p>
                    ) : (
                        <p className="mt-3 text-sm text-gray-500">...</p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-8 gap-3">
                    <button
                        onClick={handleUpload}
                        disabled={!parsedData}
                        className={`px-6 py-2 rounded-lg font-medium text-white ${parsedData
                            ? "bg-[#4A90E2] hover:bg-[#3A7BC8] cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Upload
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportCSVDialog;
