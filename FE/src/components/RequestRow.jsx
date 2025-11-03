import React from 'react';

const RequestRow = ({ request, onConfirmDelivery }) => {
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
            
            {/* Column 1: Title (Book Info) - Width 25% */}
            <div className="w-[25%] flex items-center pr-4 min-w-[150px]">
                <img
                    src={request.cover}
                    alt={request.title}
                    className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0 shadow-sm"
 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x56/EEE/313131?text=No+Cover'; }}
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">{request.title}</p>
                    <p className="text-xs text-gray-500">{request.author}</p>
                </div>
            </div>

            {/* Column 2: User - Width 12% */}
            <div className="w-[12%] text-sm font-medium text-gray-700 truncate pr-4 min-w-[70px]">
                {request.user}
            </div>

            {/* Column 3: Copy ID - Width 10% */}
            <div className="w-[10%] text-sm font-mono font-semibold text-gray-800 pr-4 min-w-[60px]">
                {request.copyId}
            </div>

            {/* Column 4: Condition - Width 13% */}
            <div className="w-[13%] pr-4 min-w-[90px]">
                <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${getConditionColor(request.condition)}`}>
                        {request.condition}%
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[50px]">
                        <div 
                            className={`h-1.5 rounded-full ${getConditionBg(request.condition)}`}
                            style={{ width: `${request.condition}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Column 5: Pick-up Date - Width 15% */}
            <div className="w-[15%] text-sm text-gray-700 pr-4 min-w-[100px]">
                {request.pickupDate}
            </div>

            {/* Column 6: Return Date - Width 15% */}
            <div className="w-[15%] text-sm text-gray-700 pr-4 min-w-[100px]">
                {request.returnDate}
            </div>

            {/* Column 7: Action - Width 10% */}
            <div className="w-[10%] flex justify-end min-w-[140px]">
                <button
                    onClick={() => onConfirmDelivery(request.id)}
                    className="px-3 py-2 text-xs font-medium text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md"
                >
                    Confirm Delivery
                </button>
            </div>
        </div>
    );
};

export default RequestRow;