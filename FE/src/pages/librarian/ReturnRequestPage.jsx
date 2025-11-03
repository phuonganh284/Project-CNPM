import React, { useState } from 'react';
import { mockReturnRequests } from '../../data/mockReturnRequests';
import { mockBooks } from '../../data/mockBooks';
import ReturnRequestCard from '../../components/ReturnRequestCard';
import AssessDrawer from '../../components/AssessDrawer';

const ReturnRequestPage = () => {
  const [requests, setRequests] = useState(mockReturnRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAssess = (req) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleSaveAssessment = (requestId, assessmentData) => {
    setRequests(prev => prev.map(r =>
      r.id === requestId ? {
        ...r,
        status: assessmentData.charge_total > 0 ? 'ASSESSED_MODERATE' : 'ASSESSED',
        charge_total: assessmentData.charge_total
      } : r
    ));
  };

  // Helper: get book data from mockBooks
  const getBookData = (bookTitle) => {
    return mockBooks.find(b => b.title === bookTitle);
  };

  const handleReceiveBook = (id) => {
    // Remove request from list after receiving book
    setRequests(prev => prev.filter(r => r.id !== id));
    // Close drawer if it's open for this request
    if (selectedRequest?.id === id) {
      setIsDrawerOpen(false);
      setSelectedRequest(null);
    }
  };

  // Helper: get book cover from mockBooks
  const getBookCover = (bookTitle) => {
    const book = mockBooks.find(b => b.title === bookTitle);
    return book?.cover || 'https://via.placeholder.com/167x203?text=No+Cover';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Return Requests</h2>

      {/* Table Header - Sticky */}
      <div className="sticky top-0 z-10 bg-[#F3F3F7] py-3 mb-4">
        <div className="flex items-center px-6 gap-4 text-gray-600 font-inter text-sm font-medium max-w-[1200px]">
          {/* Book Cover Space */}
          <div className="w-[70px] flex-shrink-0 mr-2"></div>

          {/* Title */}
          <div className="flex-1 min-w-0 max-w-[290px]">Title</div>

          {/* User */}
          <div className="w-[100px] flex-shrink-0 mr-7">Username</div>

          {/* Status + Charge Total + Action (rightContent area) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-[150px] flex-shrink-0 mr-7">Status</div>
            <div className="w-[120px] flex-shrink-0 mr-11">Charge Total</div>
            <div className="w-[200px] flex-shrink-0">Action</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {requests.map(req => {
          const book = mockBooks.find(b => b.title === req.bookTitle);

          return (
            <ReturnRequestCard
              key={req.id}
              bookCover={getBookCover(req.bookTitle)}
              bookTitle={req.bookTitle}
              bookAuthor={book?.author || 'Unknown'}
              bookYear={book?.publish_year || 'N/A'}
              userName={req.userName}
              rightContent={
                <>
                  {/* Status */}
                  <div className="w-[150px] flex-shrink-0 mr-8">
                    {req.status === 'PENDING' && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        PENDING
                      </span>
                    )}
                    {req.status === 'ASSESSED' && (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ASSESSED: OK
                      </span>
                    )}
                    {req.status === 'ASSESSED_MODERATE' && (
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        ASSESSED: MODERATE
                      </span>
                    )}
                    {req.status === 'COMPLETED' && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  {/* Charge Total */}
                  <div className="w-[120px] flex-shrink-0 mr-10">
                    {req.charge_total !== undefined ? (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Charge: ${req.charge_total}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Charge: NA
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssess(req);
                      }}
                      className="px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all whitespace-nowrap bg-[#4A90E2] text-white hover:bg-[#3A7BC8] cursor-pointer"
                    >
                      Assess
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReceiveBook(req.id);
                      }}
                      disabled={req.charge_total === undefined}
                      className={`
                        px-4 py-2 rounded-lg font-inter text-sm font-medium
                        transition-all whitespace-nowrap
                        ${req.charge_total !== undefined
                          ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      Receive Book
                    </button>
                  </div>
                </>
              }
              onClick={() => console.log('View detail:', req.id)}
            />
          );
        })}
      </div>

      {/* Assess Drawer */}
      <AssessDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        returnRequest={selectedRequest}
        bookData={selectedRequest ? getBookData(selectedRequest.bookTitle) : null}
        onSave={handleSaveAssessment}
      />
    </div>
  );
};

export default ReturnRequestPage;
