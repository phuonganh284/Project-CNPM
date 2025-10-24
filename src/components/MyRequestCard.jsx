import React from 'react';

export const RequestBookCard = ({
  coverUrl,
  title,
  author,
  year,
  requestedAt,
  status,
  onPreview = () => {},
  onCancel = () => {},
}) => (
  <div className="flex bg-white rounded-2xl shadow w-83 p-5 gap-6 items-start">
    {/* Khối bên trái: hình ảnh sách và thông tin */}
    <div className="flex flex-col items-center min-w-[110px] max-w-[110px]">
      <img
        src={coverUrl}                 // Ảnh bìa sách
        alt={title}                   // Văn bản thay thế khi ảnh không hiện
        className="w-[110px] h-[148px] object-cover rounded mb-2"
      />
      <div className="mt-2 w-full">
        {/* Tiêu đề sách */}
        <div className="font-semibold text-gray-900 text-base">{title}</div>
        {/* Tác giả và năm xuất bản */}
        <div className="text-gray-500 text-sm">{author}, {year}</div>
      </div>
    </div>

    {/* Khối bên phải: thông tin yêu cầu và nút thao tác */}
    <div className="flex-1 flex flex-col justify-between h-full">
      <div>
        {/* Ngày yêu cầu */}
        <div className="text-gray-700 text-base font-medium mb-1">Requested on</div>
        <div className="text-gray-800 text-sm">{requestedAt}</div>
        {/* Trạng thái: sử dụng dấu chấm màu xanh lá cho Approved, cam cho Pending */}
        <div className="flex items-center gap-2 mt-2 mb-4">
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              status === "Approved" ? "bg-green-500" : "bg-orange-500"
            }`}
          ></span>
          <span className="text-gray-700 text-sm">{status}</span>
        </div>
      </div>

      {/* Nút Preview và Cancel request */}
      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={onPreview}      // Xử lý khi nhấn Preview
          className="border-2 font-semibold rounded-lg px-5 py-1 hover:bg-blue-50 transition " style={{ color: '#3273AF' }}
        >
          Preview
        </button>
        <button
          onClick={onCancel}       // Xử lý khi nhấn Cancel request
          className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-5 py-1"
        >
          Cancel request
        </button>
      </div>
    </div>
  </div>
);
