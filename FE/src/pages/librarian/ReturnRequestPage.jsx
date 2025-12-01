import React, { useState, useEffect } from 'react';
import ReturnRequestCard from '../../components/ReturnRequestCard';
import AssessDrawer from '../../components/AssessDrawer';
import borrowingService from '../../services/borrowingService';

const ReturnRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchReturnRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowingService.getReturnRequests();
      setRequests(data.data);
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching return requests. Please try again.';
      setError(errorMessage);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const handleAssess = (req) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleSaveAssessment = async (requestId, assessmentData) => {
    try {
      await borrowingService.assessReturn(requestId, assessmentData);
      setIsDrawerOpen(false);
      setSelectedRequest(null);
      fetchReturnRequests(); // Refresh the list
    } catch (err) {
      console.error("Failed to save assessment:", err);
      const errorMessage = err.response?.data?.message || "Failed to save assessment. Please try again.";
      setError(errorMessage);
    }
  };

  const handleReceiveBook = async (id) => {
    try {
      await borrowingService.confirmReturn(id);
      fetchReturnRequests(); // Refresh the list
      if (selectedRequest?.id === id) {
        setIsDrawerOpen(false);
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error("Failed to confirm return:", err);
      const errorMessage = err.response?.data?.message || "Failed to confirm return. Please try again.";
      setError(errorMessage);
    }
  };

  const getConditionColor = (condition) => {
    if (condition >= 80) return 'text-green-600';
    if (condition >= 60) return 'text-blue-600';
    if (condition >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading return requests...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Return Requests</h2>

      {error && (
        <p className="text-center text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="sticky top-0 z-10 bg-[#F3F3F7] py-3 mb-4">
        <div className="flex items-center px-6 gap-6 text-gray-600 font-inter text-sm font-medium max-w-[1200px]">
          <div className="w-[70px] flex-shrink-0"></div> {/* Book Cover placeholder */}
          <div className="w-[290px] flex-shrink-0">Title</div>
          <div className="w-[100px] flex-shrink-0">Username</div>
          <div className="w-[100px] flex-shrink-0">Copy ID</div>
          <div className="w-[100px] flex-shrink-0">Condition</div>
          <div className="w-[150px] flex-shrink-0">Status</div>
          <div className="w-[120px] flex-shrink-0">Charge Total</div>
          <div className="w-[200px] flex-shrink-0">Action</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {requests.length === 0 && !error ? (
          <p className="text-center text-gray-500 mt-8">No pending return requests.</p>
        ) : (
          requests.map(req => (
            <ReturnRequestCard
              key={req.id}
              bookId={req.book.id}
              bookCover={req.book.coverImageUrl}
              bookTitle={req.book.title}
              bookAuthor={req.book.author}
              bookYear={req.book.publicationYear}
              userName={req.user.fullName}
              rightContent={
                <>
                  {/* Copy ID */}
                  <div className="w-[100px] flex-shrink-0">
                    <div className="font-medium text-gray-900">{req.copyId}</div>
                  </div>
                  {/* Condition */}
                  <div className="w-[100px] flex-shrink-0">
                    <div className={`font-medium ${getConditionColor(req.borrowedCondition)}`}>
                      {req.borrowedCondition}%
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-[150px] flex-shrink-0">
                    {req.status === 'pending' && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        PENDING
                      </span>
                    )}
                    {req.status === 'assessed' && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        req.fine > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        ASSESSED
                      </span>
                    )}
                  </div>

                  {/* Charge Total */}
                  <div className="w-[120px] flex-shrink-0">
                    {req.status === 'pending' ? (
                      <span className="text-xs text-gray-500 italic">Pending Assessment</span>
                    ) : req.fine > 0 ? (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Charge: {req.fine.toLocaleString()}đ
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">No charge</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="w-[200px] flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAssess(req); }}
                      className="px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all whitespace-nowrap bg-[#4A90E2] text-white hover:bg-[#3A7BC8] cursor-pointer"
                    >
                      Assess
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReceiveBook(req.id); }}
                      disabled={req.status !== 'assessed'}
                      className={`
                        px-4 py-2 rounded-lg font-inter text-sm font-medium
                        transition-all whitespace-nowrap
                        ${req.status === 'assessed'
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
                      ))        )}
      </div>

      <AssessDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        returnRequest={selectedRequest}
        onSave={handleSaveAssessment}
      />
    </div>
  );
};

export default ReturnRequestPage;
