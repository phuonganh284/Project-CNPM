import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestBookCard } from '../../components/MyRequestCard.jsx';
import { mockRequestBooks } from '../../data/mockRequestBooks.js';

// Component hiển thị hộp thoại xác nhận hủy yêu cầu
const CancelConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  // Nếu biến `isOpen` là false thì không hiển thị gì
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-xl shadow p-8 min-w-[400px] min-h-[300px] flex flex-col justify-center items-center">
        {/* Tiêu đề của modal */}
        <div className="text-lg font-semibold mb-6 p-5">Cancel request confirmation</div>

        {/* Nút xác nhận hủy */}
        <button
          className="w-40 bg-[#3273AF] text-white py-2 rounded mb-3 font-medium text-lg"
          onClick={onConfirm}
        >
          Confirm
        </button>

        {/* Nút đóng modal */}
        <button
          className="w-40 bg-[#4D4D4D] text-white py-2 rounded font-medium text-lg"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Component chính: MyRequestsPage
const MyRequestsPage = () => {
  // Biến điều khiển hiển thị modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lưu trữ thông tin về sách được chọn để hủy
  const [selectedBook, setSelectedBook] = useState(null);

  const navigate = useNavigate();

  // Xử lý khi người dùng nhấn nút "Cancel request" của từng sách
  const handleCancelClick = (book) => {
    setSelectedBook(book);   // Lưu sách được chọn
    setIsModalOpen(true);    // Hiển thị modal xác nhận
  };

  // Khi người dùng nhấn "Confirm" trong modal
  const handleConfirmCancel = () => {
    alert(`You canceled: ${selectedBook.title}`); // Hiển thị thông báo (chỉ để test)
    setIsModalOpen(false);   // Đóng modal
    setSelectedBook(null);   // Xóa dữ liệu sách đã chọn
  };

  // Khi người dùng nhấn "Cancel" (đóng modal mà không làm gì)
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle Preview button click - navigate to book detail
  const handlePreview = (bookId) => {
    navigate(`/book/${bookId}`); // Navigate to book detail page
  };
  return (
    <div className="bg-[#F3F3F7] min-h-screen pb-10 -m-4 p-4 mt-4">
      <div className="mb-6">
        {/* Phần tiêu đề */}
        <h1 className="text-gray-800 font-inter text-2xl font-bold mb-2">
          Your <span className="font-inter text-2xl font-bold mb-2" style={{ color: '#3273AF' }}>Requests</span>
        </h1>
      </div>

      {/* Lưới hiển thị danh sách các yêu cầu mượn sách */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
        {mockRequestBooks.map((book) => (
          <RequestBookCard
            key={book.id}                      // Mỗi phần tử phải có key riêng
            coverUrl={book.coverUrl}           // Truyền hình ảnh bìa
            title={book.title}                 // Truyền tiêu đề sách
            author={book.author}               // Truyền tác giả
            year={book.year}                   // Truyền năm xuất bản
            requestedAt={book.requestedAt}     // Ngày yêu cầu
            status={book.status}               // Trạng thái (Pending / Approved)
            onCancel={() => handleCancelClick(book)}  // Gọi hàm khi nhấn nút hủy
            onPreview={() => handlePreview(book.id)}
          />
        ))}
      </div>

      {/* Hiển thị modal xác nhận khi biến `isModalOpen` là true */}
      <CancelConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default MyRequestsPage;
