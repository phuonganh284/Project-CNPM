import React from 'react';

const RequestRow = ({ request, onConfirmDelivery }) => {
    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow duration-200">
            
            {/* Column 1: Title (Book Info) - Width 35% */}
            <div className="w-[35%] flex items-center pr-4 min-w-[200px]">
                <img
                    src={request.cover}
                    alt={request.title}
                    className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0 shadow-sm"
                    // Placeholder if image fails to load
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x56/EEE/313131?text=No+Cover'; }}
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">{request.title}</p>
                    <p className="text-xs text-gray-500">{request.author}</p>
                </div>
            </div>

            {/* Column 2: User - Width 15% */}
            <div className="w-[15%] text-sm font-medium text-gray-700 truncate pr-4 min-w-[80px]">
                {request.user}
            </div>

            {/* Column 3: Pick-up Date - Width 20% */}
            <div className="w-[20%] text-sm text-gray-700 pr-4 min-w-[120px]">
                {request.pickupDate}
            </div>

            {/* Column 4: Return Date - Width 20% */}
            <div className="w-[20%] text-sm text-gray-700 pr-4 min-w-[120px]">
                {request.returnDate}
            </div>

            {/* Column 5: Action - Width 10% */}
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