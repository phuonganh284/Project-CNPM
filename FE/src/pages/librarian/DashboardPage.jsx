import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardData();
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = data?.stats || {};
  const recentActivities = data?.recentActivities || [];
  const popularBooks = data?.popularBooks || [];

  const getActivityIcon = (type) => {
    const icons = {
      BORROW_REQUEST: '📚',
      RETURN_REQUEST: '↩️',
      APPROVED: '✅',
      OVERDUE: '⚠️',
    };
    return icons[type] || '📋';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      assessed: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[#F3F3F7] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back! Here's what's happening in your library today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Books</p>
            <span className="text-2xl">📚</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalBooks || 0}</p>
          <p className="text-xs text-green-600 mt-2">
            {stats.availableBooks || 0} available
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active Readers</p>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.activeReaders || 0}</p>
          <p className="text-xs text-gray-500 mt-2">
            of {stats.totalReaders || 0} total
          </p>
        </div>

        <div 
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/borrow-requests')}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Requests</p>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests || 0}</p>
          <p className="text-xs text-blue-600 mt-2 hover:underline">
            View all →
          </p>
        </div>

        <div 
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/borrowing')}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Overdue Books</p>
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.overdueBooks || 0}</p>
          <p className="text-xs text-blue-600 mt-2 hover:underline">
            View all →
          </p>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/approved-requests')}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Approved Requests</p>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.approvedRequests || 0}</p>
          <p className="text-xs text-gray-500 mt-2">Waiting for pickup</p>
        </div>

        <div 
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/return-requests')}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Return Requests</p>
            <span className="text-2xl">↩️</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.returnRequests || 0}</p>
          <p className="text-xs text-gray-500 mt-2">Need assessment</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 mb-1">Total Fees Collected</p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{(stats.totalRevenue || 0).toLocaleString()} đ</p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? recentActivities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {activity.book}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-8">No recent activities.</p>}
          </div>
          <button
            onClick={() => navigate('/borrowing')}
            className="mt-4 w-full text-center text-sm text-blue-600 hover:underline"
          >
            View all activities →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Most Borrowed Books</h2>
          <div className="space-y-4">
            {popularBooks.length > 0 ? popularBooks.map((book, index) => (
              <div key={book.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-10 h-14 object-cover rounded shadow-sm cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40x56?text=No+Cover';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {book.borrowCount} borrows
                  </p>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-8">No borrowed books yet.</p>}
          </div>
          <button
            onClick={() => navigate('/books')}
            className="mt-4 w-full text-center text-sm text-blue-600 hover:underline"
          >
            View all books →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
