// src/components/BorrowCard.jsx
import React from 'react';

const BorrowCard = ({ borrow, onRenewClick, onReturnClick }) => {
    const isRenewDisabled = borrow.renewed || borrow.isOverdue || borrow.isPendingReturn;
    const isReturnDisabled = borrow.isPendingReturn;

    const renewButtonClasses = `w-full px-4 py-2 text-sm rounded border transition-colors duration-200 
        ${isRenewDisabled
            ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50 cursor-pointer'
        }`;

    const getRenewButtonText = () => {
        if (borrow.renewed) return 'Renewed';
        if (borrow.isOverdue) return 'Overdue';
        return 'Renew';
    };

    const getReturnButtonText = () => {
        return borrow.isPendingReturn ? 'Pending' : 'Return';
    };

    const returnButtonClasses = `w-full px-4 py-2 text-sm text-white rounded transition-colors duration-200
        ${isReturnDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 cursor-pointer'
        }`;

    const getConditionColor = (condition) => {
        if (condition >= 80) return 'text-green-600';
        if (condition >= 60) return 'text-blue-600';
        if (condition >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getConditionLabel = (condition) => {
        if (condition >= 80) return 'Excellent';
        if (condition >= 60) return 'Good';
        if (condition >= 50) return 'Fair';
        return 'Poor';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md relative">
            {/* ✅ Hiển thị chấm màu trạng thái */}
            {borrow.isPendingReturn ? (
                <div
                    className="absolute bottom-2 left-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"
                    title="This book is pending return"
                ></div>
            ) : borrow.isOverdue ? (
                <div
                    className="absolute bottom-2 left-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md"
                    title="This book is overdue!"
                ></div>
            ) : borrow.renewed ? (
                <div
                    className="absolute bottom-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"
                    title="This book has been renewed once and cannot be renewed again"
                ></div>
            ) : null}

            <div className="flex justify-between items-start">
                <div className="flex flex-col items-start w-1/2">
                    <img
                        src={borrow.cover}
                        alt={borrow.title}
                        className="w-20 h-28 object-cover rounded mb-2"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/80x112/EEE/313131?text=No+Cover';
                        }}
                    />
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mt-1">{borrow.title}</h3>
                    <p className="text-xs text-gray-500">{borrow.author}</p>

                    {/* Copy ID & Condition */}
                    <div className="mt-2 w-full">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Copy {borrow.copyId}</span>
                            <span className={`font-semibold ${getConditionColor(borrow.borrowedCondition)}`}>
                                {borrow.borrowedCondition}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full ${borrow.borrowedCondition >= 80 ? 'bg-green-500' :
                                    borrow.borrowedCondition >= 60 ? 'bg-blue-500' :
                                        borrow.borrowedCondition >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${borrow.borrowedCondition}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {getConditionLabel(borrow.borrowedCondition)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end w-1/2 ml-2">
                    <div className="text-right mb-4">
                        <p className="text-xs text-gray-500 mb-1">Borrowed on</p>
                        <p className="text-sm font-medium text-gray-700 mb-3">{formatDate(borrow.borrowDate)}</p>

                        <p className="text-xs font-semibold text-gray-600 mb-1">Return Due</p>
                        <p className="text-sm font-medium text-gray-700">{formatDate(borrow.dueDate)}</p>
                    </div>

                    <div className="w-full flex flex-col space-y-2">
                        <button
                            onClick={() => onRenewClick(borrow)}
                            className={renewButtonClasses}
                            disabled={isRenewDisabled}
                        >
                            {getRenewButtonText()}
                        </button>
                        <button
                            onClick={() => onReturnClick(borrow)}
                            className={returnButtonClasses}
                            disabled={isReturnDisabled}
                        >
                            {getReturnButtonText()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowCard;
