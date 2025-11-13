import React, { useState, useEffect } from 'react';
import borrowingService from '../../services/borrowingService';

const BorrowingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await borrowingService.getBorrowingHistory();
        setHistory(data.data);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching your borrowing history. Please try again.';
        setError(errorMessage);
        setHistory([]); // Ensure data is empty on error
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filter history by status
  const filteredHistory = filterStatus === 'All' 
    ? history 
    : history.filter(record => 
        filterStatus === 'Late' 
          ? record.status === 'Returned Late' // Assuming this status comes from backend
          : record.status === 'Returned'
      );

  const totalLateFees = history.reduce((sum, record) => sum + (record.late_fee || 0), 0);
  const totalDamageFees = history.reduce((sum, record) => sum + (record.damage_fee || 0), 0);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading borrowing history...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Borrowing History</h1>
        <p className="text-sm text-gray-600">View your complete borrowing history and track any charges.</p>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm mb-4">{error}</p>
      )}

      {history.length === 0 && !error ? (
        <div className="text-center p-10 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">You have no borrowing history yet.</p>
            <p className="text-gray-400 text-sm mt-2">Once you borrow and return books, your history will appear here.</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Total Books Borrowed</p>
              <p className="text-2xl font-bold text-gray-800">{history.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Returned On Time</p>
              <p className="text-2xl font-bold text-green-600">
                {history.filter(r => r.status === 'Returned').length}
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
                All ({history.length})
              </button>
              <button
                onClick={() => setFilterStatus('On Time')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'On Time'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                On Time ({history.filter(r => r.status === 'Returned').length})
              </button>
              <button
                onClick={() => setFilterStatus('Late')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'Late'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Late ({history.filter(r => r.status === 'Returned Late').length})
              </button>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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

            <div className="divide-y divide-gray-200">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record) => {
                  const totalCharge = (record.late_fee || 0) + (record.damage_fee || 0);
                  
                  return (
                    <div
                      key={record.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <img
                          src={record.book.cover_image_url}
                          alt={record.book.title}
                          className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40x56?text=No+Cover'; }}
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-0.5 truncate text-sm">
                            {record.book.title}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">{record.book.author}</p>
                        </div>
                      </div>
                      <div className="col-span-1 text-gray-600 text-sm font-mono">{record.copy_id}</div>
                      <div className="col-span-1 text-gray-600 text-xs">{new Date(record.borrow_date).toLocaleDateString()}</div>
                      <div className="col-span-1 text-gray-600 text-xs">{new Date(record.due_date).toLocaleDateString()}</div>
                      <div className="col-span-1 text-gray-600 text-xs">{new Date(record.return_date).toLocaleDateString()}</div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${
                            record.returned_condition >= 80 ? 'text-green-600' :
                            record.returned_condition >= 60 ? 'text-blue-600' :
                            record.returned_condition >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {record.returned_condition}%
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                            <div 
                              className={`h-1.5 rounded-full ${
                                record.returned_condition >= 80 ? 'bg-green-500' :
                                record.returned_condition >= 60 ? 'bg-blue-500' :
                                record.returned_condition >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${record.returned_condition}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap inline-block ${
                          record.status === 'Returned' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status === 'Returned' ? 'On Time' : 'Late'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        {totalCharge > 0 ? (
                          <div>
                            <span className="text-red-600 font-semibold text-sm">${totalCharge}</span>
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
                  No records found for this filter.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BorrowingHistoryPage;
