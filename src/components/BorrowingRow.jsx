import React from 'react';

const BorrowingRow = ({ borrow }) => {
    
    // Logic để xác định màu sắc dựa trên status
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

    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow duration-200">
            
            {/* Column 1: Title (Book Info) - Width 40% */}
            <div className="w-[40%] flex items-center pr-4 min-w-[200px]">
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

            {/* Column 2: User - Width 20% */}
            <div className="w-[20%] text-sm font-medium text-gray-700 truncate pr-4 min-w-[100px]">
                {borrow.user}
            </div>

            {/* Column 3: Return Date - Width 20% */}
            <div className="w-[20%] text-sm text-gray-700 pr-4 min-w-[120px]">
                {borrow.returnDate}
            </div>

            {/* Column 4: Status - Width 20% */}
            <div className="w-[20%] flex justify-start pr-4 min-w-[100px]">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(borrow.status)}`}>
                    {borrow.status}
                </span>
            </div>
        </div>
    );
};

export default BorrowingRow;