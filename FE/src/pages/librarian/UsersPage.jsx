import React, { useState } from "react";
import UserCard from "../../components/UserCard";
import { mockReaders } from "../../data/mockReaders";

const UsersPage = () => {
  const [users, setUsers] = useState(mockReaders);

  const handleBanUser = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userId === id ? { ...user, status: "banned" } : user
      )
    );
  };

  const handleUnBanUser = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userId === id ? { ...user, status: "active" } : user
      )
    );
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Manage Readers
      </h2>

      {/* Table Header - Same style as Books Page */}
      <div className="sticky top-0 z-10 bg-[#F3F3F7] py-3 mb-4">
        <div className="flex items-center px-4 gap-4 text-gray-600 font-inter text-sm font-medium ">
          <div className="w-[70px] flex-shrink-0 mr-2"></div>
          <div className="flex-1 min-w-0 max-w-[250px] mr-5">Username</div>
          <div className="w-[150px] flex-shrink-0 mr-24">User ID</div>
          <div className="w-[130px] flex-shrink-0 mr-36">Status</div>
          <div className="w-[100px] flex-shrink-0">Action</div>
        </div>
      </div>

      {/* User Cards */}
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <UserCard
            key={user.userId}
            profilePic={`https://i.pravatar.cc/100?u=${user.userId}`} // mock pfp
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
