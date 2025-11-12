import React, { useState, useEffect } from "react";
import UserCard from "../../components/UserCard";
import { getUsersAdmin, updateUserAdmin } from "../../services/userAdminService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsersAdmin();
      // normalize shape: backend returns user_id and role
      const normalized = (data || []).map((u) => ({
        userId: u.user_id || u.id || u.userId,
        username: u.username,
        email: u.email,
        name: u.name,
        status: u.status || 'active',
        profile_picture: u.profile_picture,
        borrow_count: u.borrow_count,
        role: u.role || 'unknown',
      }));
      // only show readers (exclude librarians)
      const readers = normalized.filter((u) => u.role === 'reader');
      // If backend doesn't provide role info (all 'unknown'), fall back to showing everyone
      const hasRoleInfo = normalized.some((u) => u.role && u.role !== 'unknown');
      setUsers(hasRoleInfo ? readers : normalized);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBanUser = async (id) => {
    try {
      // optimistic update
      setUsers((prev) => prev.map(u => u.userId == id ? { ...u, status: 'banned' } : u));
      await updateUserAdmin(id, { status: 'banned' });
    } catch (err) {
      console.error('Failed to ban user:', err);
      // revert
      loadUsers();
    }
  };

  const handleUnBanUser = async (id) => {
    try {
      setUsers((prev) => prev.map(u => u.userId == id ? { ...u, status: 'active' } : u));
      await updateUserAdmin(id, { status: 'active' });
    } catch (err) {
      console.error('Failed to unban user:', err);
      loadUsers();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Manage Readers</h2>

      <div className="sticky top-0 z-10 bg-[#F3F3F7] py-3 mb-4">
        <div className="flex items-center px-4 gap-4 text-gray-600 font-inter text-sm font-medium ">
          <div className="w-[70px] flex-shrink-0 mr-2"></div>
          <div className="flex-1 min-w-0 max-w-[250px] mr-5">Username</div>
          <div className="w-[150px] flex-shrink-0 mr-24">User ID</div>
          <div className="w-[130px] flex-shrink-0 mr-36">Status</div>
          <div className="w-[100px] flex-shrink-0">Action</div>
        </div>
      </div>

      {loading && <div className="p-6">Loading...</div>}
      {error && <div className="p-6 text-red-500">{error}</div>}

      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <UserCard
            key={user.userId}
            profilePic={user.profile_picture || `https://i.pravatar.cc/100?u=${user.userId}`}
            userId={user.userId}
            username={user.username}
            email={user.email}
            name={user.name}
            status={user.status}
            onBan={() => handleBanUser(user.userId)}
            onUnBan={() => handleUnBanUser(user.userId)}
          />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
