import React, { useState } from 'react';

const BorrowingHistoryPage = () => {
  // TODO: KHI CÓ BE - Fetch borrowing history từ API
  // const { data: history, isLoading } = useQuery(['borrowing-history'], fetchBorrowingHistory);
  
  const [filterStatus, setFilterStatus] = useState('All');

  const mockHistory = [
    {
      id: 1,
      loanId: "L101",
      copyId: "C005",
      bookTitle: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
      borrowedDate: "2024-10-01",
      returnedDate: "2024-10-15",
      dueDate: "2024-10-14",
      status: "Returned",
      lateFee: 0,
      borrowedCondition: 90, // Condition khi nhận sách
      returnedCondition: 85, // Condition đánh giá bởi thủ thư khi trả
      damageFee: 5, // Phí hư hỏng nếu condition giảm
    },
    {
      id: 2,
      loanId: "L102",
      copyId: "C008",
      bookTitle: "To Kill a Mockingbird",
      author: "Harper Lee",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
      borrowedDate: "2024-09-15",
      returnedDate: "2024-10-05",
      dueDate: "2024-09-29",
      status: "Returned Late",
      lateFee: 10,
      borrowedCondition: 75,
      returnedCondition: 70,
      damageFee: 5,
    },
    {
      id: 3,
      loanId: "L103",
      copyId: "C011",
      bookTitle: "1984",
      author: "George Orwell",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",
      borrowedDate: "2024-08-20",
      returnedDate: "2024-09-10",
      dueDate: "2024-09-15",
      status: "Returned",
      lateFee: 0,
      borrowedCondition: 100,
      returnedCondition: 95,
      damageFee: 5,
    },
    {
      id: 4,
      loanId: "L104",
      copyId: "C014",
      bookTitle: "Pride and Prejudice",
      author: "Jane Austen",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg",
      borrowedDate: "2024-07-10",
      returnedDate: "2024-08-01",
      dueDate: "2024-07-30",
      status: "Returned Late",
      lateFee: 2,
      borrowedCondition: 60,
      returnedCondition: 55,
      damageFee: 5,
    },
    {
      id: 5,
      loanId: "L105",
      copyId: "C017",
      bookTitle: "The Catcher in the Rye",
      author: "J.D. Salinger",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
      borrowedDate: "2024-06-05",
      returnedDate: "2024-06-25",
      dueDate: "2024-06-28",
      status: "Returned",
      lateFee: 0,
      borrowedCondition: 85,
      returnedCondition: 80,
      damageFee: 5,
    },
  ];

  // Filter history by status
  const filteredHistory = filterStatus === 'All' 
    ? mockHistory 
    : mockHistory.filter(record => 
        filterStatus === 'Late' 
          ? record.status === 'Returned Late'
          : record.status === 'Returned'
      );

  const totalLateFees = mockHistory.reduce((sum, record) => sum + record.lateFee, 0);
  const totalDamageFees = mockHistory.reduce((sum, record) => sum + (record.damageFee || 0), 0);

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Borrowing History</h1>
        <p className="text-sm text-gray-600">View your complete borrowing history and track late fees</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Books Borrowed</p>
          <p className="text-2xl font-bold text-gray-800">{mockHistory.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Returned On Time</p>
          <p className="text-2xl font-bold text-green-600">
            {mockHistory.filter(r => r.status === 'Returned').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Charges</p>
          <p className="text-2xl font-bold text-red-600">${totalLateFees + totalDamageFees}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({mockHistory.length})
          </button>
          <button
            onClick={() => setFilterStatus('On Time')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'On Time'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            On Time ({mockHistory.filter(r => r.status === 'Returned').length})
          </button>
          <button
            onClick={() => setFilterStatus('Late')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'Late'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Late ({mockHistory.filter(r => r.status === 'Returned Late').length})
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
          <div className="col-span-3">Book</div>
          <div className="col-span-1">Copy</div>
          <div className="col-span-1">Borrowed</div>
          <div className="col-span-1">Due Date</div>
          <div className="col-span-1">Returned</div>
          <div className="col-span-2">Assessed Condition</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Total Charge</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((record) => {
              const totalCharge = (record.lateFee || 0) + (record.damageFee || 0);
              
              return (
                <div
                  key={record.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Book Column with Cover */}
                  <div className="col-span-3 flex items-center gap-3">
                    <img
                      src={record.coverUrl}
                      alt={record.bookTitle}
                      className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x56?text=No+Cover';
                      }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-0.5 truncate text-sm">
                        {record.bookTitle}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{record.author}</p>
                    </div>
                  </div>

                  {/* Copy ID */}
                  <div className="col-span-1 text-gray-600 text-sm font-mono">
                    {record.copyId}
                  </div>

                  {/* Borrowed Date */}
                  <div className="col-span-1 text-gray-600 text-xs">
                    {record.borrowedDate}
                  </div>

                  {/* Due Date */}
                  <div className="col-span-1 text-gray-600 text-xs">
                    {record.dueDate}
                  </div>

                  {/* Returned Date */}
                  <div className="col-span-1 text-gray-600 text-xs">
                    {record.returnedDate}
                  </div>

                  {/* Assessed Condition (by librarian) */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${
                        record.returnedCondition >= 80 ? 'text-green-600' :
                        record.returnedCondition >= 60 ? 'text-blue-600' :
                        record.returnedCondition >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {record.returnedCondition}%
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                        <div 
                          className={`h-1.5 rounded-full ${
                            record.returnedCondition >= 80 ? 'bg-green-500' :
                            record.returnedCondition >= 60 ? 'bg-blue-500' :
                            record.returnedCondition >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${record.returnedCondition}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {record.returnedCondition >= 80 ? 'Excellent' :
                       record.returnedCondition >= 60 ? 'Good' :
                       record.returnedCondition >= 50 ? 'Fair' : 'Poor'}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap inline-block ${
                      record.status === 'Returned' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status === 'Returned' ? 'On Time' : 'Late'}
                    </span>
                  </div>

                  {/* Total Charge */}
                  <div className="col-span-2">
                    {totalCharge > 0 ? (
                      <div>
                        <span className="text-red-600 font-semibold text-sm">
                          ${totalCharge}
                        </span>
                        {record.lateFee > 0 && record.damageFee > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Late: ${record.lateFee} + Damage: ${record.damageFee}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              No records found for this filter
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowingHistoryPage;
