import React from 'react';

const BorrowingRow = ({ borrow }) => {

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Overdue':
                return 'bg-red-500 text-white';
            case 'Active':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
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

    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow duration-200">

            {/* Column 1: Title (Book Info) - Width 30% */}
            <div className="w-[30%] flex items-center pr-4 min-w-[180px]">
                <img
                    src={borrow.cover}
                    alt={borrow.title}
                    className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0 shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x56/EEE/313131?text=No+Cover'; }}
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">{borrow.title}</p>
                    <p className="text-xs text-gray-500">{borrow.author}</p>
                </div>
            </div>

            {/* Column 2: User - Width 15% */}
            <div className="w-[15%] text-sm font-medium text-gray-700 truncate pr-4 min-w-[80px]">
                {borrow.user}
            </div>

            {/* Column 3: Copy ID - Width 10% */}
            <div className="w-[10%] text-sm font-mono font-semibold text-gray-800 pr-4 min-w-[60px]">
                {borrow.copyId}
            </div>

            {/* Column 4: Condition - Width 15% */}
            <div className="w-[15%] pr-4 min-w-[100px]">
                <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${getConditionColor(borrow.borrowedCondition)}`}>
                        {borrow.borrowedCondition}%
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                        <div 
                            className={`h-1.5 rounded-full ${getConditionBg(borrow.borrowedCondition)}`}
                            style={{ width: `${borrow.borrowedCondition}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Column 5: Return Date - Width 15% */}
            <div className="w-[15%] text-sm text-gray-700 pr-4 min-w-[100px]">
                {borrow.returnDate}
            </div>

            {/* Column 6: Status - Width 15% */}
            <div className="w-[15%] flex justify-start pr-4 min-w-[100px]">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(borrow.status)}`}>
                    {borrow.status}
                </span>
            </div>
        </div>
    );
};

export default BorrowingRow;