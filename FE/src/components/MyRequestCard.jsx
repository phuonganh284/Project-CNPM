import React from 'react';

export const RequestBookCard = ({
  coverUrl,
  title,
  author,
  year,
  requestedAt,
  status,
  copyId,        // ← Thêm prop
  condition,     // ← Thêm prop
  onPreview = () => { },
  onCancel = () => { },
}) => {
  // Helper functions for condition display
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

          {/* Copy info - Luôn hiển thị vì mọi request đều có copy */}
          {copyId && condition !== undefined && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-semibold text-gray-800 text-sm">{copyId}</span>
                <span className={`text-sm font-semibold ${getConditionColor(condition)}`}>
                  {condition}%
                </span>
              </div>
              {/* Condition bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getConditionBg(condition)}`}
                  style={{ width: `${condition}%` }}
                ></div>
              </div>
            </div>
          )}
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
              className={`w-2 h-2 rounded-full inline-block ${status === "approved" ? "bg-green-500" : "bg-orange-500"
                }`}
            ></span>
            <span className="text-gray-700 text-sm">{status}</span>
          </div>
        </div>

        {/* Nút Preview và Cancel request */}
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={onPreview}      // Xử lý khi nhấn Preview
            className="border-2 font-semibold rounded-lg px-5 py-1 hover:bg-blue-50 transition cursor-pointer" style={{ color: '#3273AF' }}
          >
            Preview
          </button>
          <button
            onClick={onCancel}       // Xử lý khi nhấn Cancel request
            disabled={status !== 'pending'}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-5 py-1 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel request
          </button>
        </div>
      </div>
    </div>
  );
};
