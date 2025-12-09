import React, { useState } from "react";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import { useNavigate } from "react-router-dom";

const UserCard = ({
    profilePic,
    userId,
    username,
    email,
    name,
    status,
    onBan,
    onUnBan,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionType, setActionType] = useState(null);
    const navigate = useNavigate();

    const handleViewClick = (e) => {
        e.stopPropagation();
        navigate(`/users/${userId}`); // navigate to user profile
    };

    const handleBanClick = (e) => {
        e.stopPropagation();
        setActionType("ban");
        setShowConfirm(true);
    };

    const handleUnBanClick = (e) => {
        e.stopPropagation();
        setActionType("unban");
        setShowConfirm(true);
    };

    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <>
            <div
                className="
                    h-[100px]
                    bg-white 
                    rounded-2xl 
                    border border-gray-200
                    flex items-center
                    px-6
                    hover:shadow-md
                    transition-shadow
                    "
            >
                {/* pfp ----------------------------*/}
                <img
                    src={profilePic || `https://i.pravatar.cc/100?u=${userId}`}
                    alt={username}
                    className="md:w-[60px] h-[60px] rounded-full object-cover flex-shrink-0 mr-6 border border-gray-300"
                />

                {/* username ----------------------- */}
                <div className="flex-1 min-w-0 max-w-[310px] mr-10">
                    <h3 className="font-inter text-base font-semibold text-gray-800 mb-1 truncate">
                        {username}
                    </h3>
                    <p className="font-inter text-sm text-gray-600 truncate">{email}</p>
                </div>

                {/* user id --------------------------*/}
                <div className="w-[105px] flex-shrink-0 mr-26">
                    <p className="font-inter text-sm text-gray-600 truncate">{userId}</p>
                </div>

                {/* status ---------------------------*/}
                <div className="w-[125px] flex-shrink-0 mr-36">
                    {status === "active" && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {displayStatus}
                        </span>
                    )}
                    {status === "borrowing" && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {displayStatus}
                        </span>
                    )}
                    {status === "overdue" && (
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-orange-700 rounded-full text-xs font-medium">
                            {displayStatus}
                        </span>
                    )}
                    {status === "banned" && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {displayStatus}
                        </span>
                    )}
                </div>

                {/* buttons --------------------------- */}
                <div className="flex gap-2">
                    <button
                        onClick={handleViewClick}
                        className="px-5 py-2 rounded-lg bg-[#4A90E2] text-white font-inter text-sm font-medium hover:bg-[#3A7BC8] cursor-pointer"
                    >
                        View
                    </button>
                    {status == "banned" ?
                        (
                            <button
                                onClick={handleUnBanClick}
                                className="w-[80px] py-2 rounded-lg text-sm font-medium transition-all border border-red-500 text-red-700 hover:bg-red-50 cursor-pointer  "
                            >
                                Unban
                            </button>
                        ) :
                        (
                            <button
                                onClick={handleBanClick}
                                disabled={status === "borrowing"}
                                className={`w-[80px] py-2 rounded-lg border text-sm font-medium transition-all ${status === "borrowing" || status === "overdue"
                                    ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-white bg-red-700 hover:bg-red-500 cursor-pointer"
                                    }`}
                            >
                                Ban
                            </button>
                        )
                    }
                </div>
            </div>

            {/* Confirm Ban Dialog */}
            <ConfirmDialog
                isOpen={showConfirm}
                title={actionType == "ban" ? "Confirm ban" : "Confirm Unban"}
                message={
                    actionType == "ban" ?
                        `Are you sure you want to ban ${name}?`
                        : `Are you sure you want to unban ${name}?`}
                onConfirm={() => {
                    setShowConfirm(false);
                    actionType == "ban" ? onBan?.() : onUnBan?.();
                }}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

export default UserCard;
