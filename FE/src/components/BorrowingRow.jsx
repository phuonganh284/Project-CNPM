import React from 'react';
import { useNavigate } from 'react-router-dom';

const BorrowingRow = ({ borrow }) => {
    const navigate = useNavigate();

    const getStatusClasses = (isOverdue) => {
        if (isOverdue) {
            return 'bg-red-500 text-white';
        }
        return 'bg-green-500 text-white';
    };

    const getStatusText = (isOverdue) => {
        if (isOverdue) {
            return 'Overdue';
        }
        return 'Active';
    };

    const getConditionColor = (condition) => {
        if (condition >= 80) return 'text-green-600';
        if (condition >= 60) return 'text-blue-600';
        if (condition >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getConditionBg = (condition) => {
        if (condition >= 80) return 'bg-green-500';
        if (condition >= 60) return 'bg-blue-500';
        if (condition >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCoverClick = () => {
        if (borrow.bookId) {
            navigate(`/book/${borrow.bookId}`);
        }
    };

    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow duration-200">

            {/* Column 1: Title (Book Info) - Width 30% */}
            <div className="w-[30%] flex items-center pr-4 min-w-[180px]">
                <img
                    src={borrow.cover || 'https://placehold.co/40x56/EEE/313131?text=No+Cover'}
                    alt={borrow.title || 'N/A'}
                    className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0 shadow-sm cursor-pointer"
                    onClick={handleCoverClick}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x56/EEE/313131?text=No+Cover'; }}
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">{borrow.title || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{borrow.author || 'N/A'}</p>
                </div>
            </div>

            {/* Column 2: User - Width 15% */}
            <div className="w-[15%] text-sm font-medium text-gray-700 truncate pr-4 min-w-[80px]">
                {borrow.readerName || 'N/A'}
            </div>

            {/* Column 3: Copy ID - Width 10% */}
            <div className="w-[10%] text-sm font-mono font-semibold text-gray-800 pr-4 min-w-[60px]">
                {borrow.copyId || 'N/A'}
            </div>

            {/* Column 4: Condition - Width 15% */}
            <div className="w-[15%] pr-4 min-w-[100px]">
                <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${getConditionColor(borrow.currentCondition)}`}>
                        {borrow.currentCondition || 'N/A'}%
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                        <div
                            className={`h-1.5 rounded-full ${getConditionBg(borrow.currentCondition)}`}
                            style={{ width: `${borrow.currentCondition || 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Column 5: Return Date - Width 15% */}
            <div className="w-[15%] text-sm text-gray-700 pr-4 min-w-[100px]">
                {formatDate(borrow.dueDate)}
            </div>

            {/* Column 6: Status - Width 15% */}
            <div className="w-[15%] flex justify-start pr-4 min-w-[100px]">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(borrow.isOverdue)}`}>
                    {getStatusText(borrow.isOverdue)}
                </span>
            </div>
        </div>
    );
};

export default BorrowingRow;