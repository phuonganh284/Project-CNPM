import React from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
        >
            <div
                className="bg-white rounded-xl shadow-lg p-6 w-[500px] text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm mb-6">{message}</p>
                <div className="flex justify-center gap-5">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-10 py-4 rounded-lg text-white  bg-[#4A90E2] text-white hover:bg-[#3A7BC8] font-semibold cursor-pointer "
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-10 py-4  rounded-lg border border-gray-300 text-gray-700  hover:bg-gray-100 font-semibold cursor-pointer "
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
