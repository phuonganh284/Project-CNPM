import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockReaders } from '../../data/mockReaders';

// Input Field Component
const InputField = ({ label, id, type = "text", placeholder, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-base font-medium text-[#4C535F]">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF]"
        />
        {children}
      </div>
    </div>
  );
};

// Password Field Component with Eye Toggle
const PasswordField = ({ label, id, name, placeholder, value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-base font-medium text-[#4C535F]">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full h-12 p-4 pr-12 bg-[#FAFBFC] border rounded-lg text-[#8D98AA] focus:outline-none ${
            error ? 'border-red-500 focus:border-red-500' : 'border-[#E0E4EC] focus:border-[#3273AF]'
          }`}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
};

// Edit Media Modal Component
const EditMediaModal = ({ isOpen, onClose, currentAvatar, onAvatarChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || '/man%201.svg');

  // Reset preview khi modal mở
  React.useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentAvatar || '/man%201.svg');
      setSelectedImage(null);
    }
  }, [isOpen, currentAvatar]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    // TODO: Implement actual image upload logic
    console.log('Applying new profile image:', selectedImage);
    
    // Cập nhật ảnh avatar trong parent component
    if (onAvatarChange) {
      onAvatarChange(previewUrl);
    }
    
    onClose();
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setPreviewUrl(currentAvatar || '/man%201.svg');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[108px] left-[304px] right-[26px] bottom-0 flex items-center justify-center z-40" style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Media</h2>
        
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img 
            src={previewUrl} 
            alt="Profile Preview" 
            className="w-24 h-24 rounded-full shadow-md object-cover"
          />
        </div>

        {/* Add Photo */}
        <div className="text-center mb-6">
          <label className="text-[#4C535F] cursor-pointer hover:text-[#3273AF] transition-colors">
            Add photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-3 bg-[#3273AF] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Change Password Modal Component
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Required field';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Required field';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Required field';
    }
    
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // TODO: Implement actual password change logic
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    setIsCompleted(false);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[108px] left-[304px] right-[26px] bottom-0 flex items-center justify-center z-40" style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        {!isCompleted ? (
          // Change Password Form
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change your password</h2>
            
            <div className="space-y-6">
              {/* Current Password */}
              <PasswordField
                label="Current password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={errors.currentPassword}
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => (window.location.href = '/send-mail-to-reset-pass')}
                  className="text-[#4C535F] underline text-sm hover:text-[#3273AF] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* New Password */}
              <PasswordField
                label="New password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword}
              />

              {/* Confirm Password */}
              <PasswordField
                label="Confirm password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-[#3273AF] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          // Success Form
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Process Completed</h2>
            
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Account Settings Form Component
function AccountSettingsForm({ onShowEditMedia, currentAvatar }) {
  const { user } = useAuth();
  const displayUser = user || { role: 'guest' };
  
  // Avatar URL - sử dụng ảnh hiện tại hoặc man 1.svg mặc định
  const avatarUrl = currentAvatar || "/man%201.svg";

  return (
    <div className="flex flex-col gap-8">
      {/* Profile Picture */}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-medium text-[#4C535F]">Your Profile Picture</h3>
               <div className="flex items-center gap-4">
                 <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full shadow-md" />
                 <button 
                   onClick={onShowEditMedia}
                   className="text-xs text-[#919191] underline hover:text-[#3273AF] transition-colors cursor-pointer"
                 >
                   Upload New photo
                 </button>
               </div>
      </div>

      {/* Form Fields */}
      <form className="flex flex-col gap-8">
        {/* Hàng 1: Tên, Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <InputField 
            label="Full name" 
            id="fullname" 
            placeholder={displayUser?.name || "Reinhard Kenson"} 
          />
          <InputField 
            label="Email" 
            id="email" 
            type="email" 
            placeholder={displayUser?.email || "Kensoncs.official@college.com"} 
          />
        </div>

        {/* Hàng 2: Username, Số điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <InputField 
            label="Username" 
            id="username" 
            placeholder={displayUser?.name || "Reinhard Kenson"} 
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-base font-medium text-[#4C535F]">
              Phone number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8D98AA]">+91</span>
              <div className="absolute left-12 top-1/2 -translate-y-1/2 h-5 w-px bg-[#E0E4EC]"></div>
              <input
                type="tel"
                id="phone"
                placeholder="9952508995"
                className="w-full h-12 pl-16 pr-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF]"
              />
            </div>
          </div>
        </div>

        {/* Hàng 3: Bio */}
        <div>
          <label htmlFor="bio" className="text-base font-medium text-[#4C535F] mb-2 block">
            Bio
          </label>
          <textarea
            id="bio"
            placeholder="I'm a Student"
            className="w-full h-24 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF] resize-none"
          ></textarea>
        </div>

        {/* Nút Submit */}
        <div>
          <button 
            type="submit" 
            className="w-48 h-12 bg-[#3273AF] text-white text-lg font-bold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </form>
    </div>
  );
}

// Login & Security Form Component
function LoginSecurityForm({ onShowModal }) {
  // Lấy dữ liệu tạm từ mockReaders (lấy phần tử đầu tiên)
  // Trong sản phẩm thật sẽ lấy từ API/user context
  const reader = mockReaders?.[0] || {
    username: 'reader_user',
    email: 'reader@example.com',
    password: 'password123'
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Fixed Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-[#4C535F]">Username</label>
          <input
            type="text"
            value={reader.username}
            readOnly
            className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#4C535F]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-[#4C535F]">Email</label>
          <input
            type="email"
            value={reader.email}
            readOnly
            className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#4C535F]"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-base font-medium text-[#4C535F]">Password</label>
          <input
            type="password"
            value={reader.password}
            readOnly
            className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#4C535F]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => (window.location.href = '/send-mail-to-reset-pass')}
          className="text-[#4C535F] underline text-left"
        >
          Forgot password?
        </button>

        <button 
          type="button" 
          onClick={onShowModal}
          className="w-48 h-12 bg-[#3273AF] text-white text-lg font-bold rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditMediaModal, setShowEditMediaModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('/man%201.svg'); // State để lưu avatar hiện tại

  return (
    <div className="p-6 min-h-screen relative">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Profile</h2>
      
      <div className="bg-white rounded-lg shadow p-8 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-3 border-b-2 border-[#E0E4EC] mb-8">
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex flex-col gap-2 items-center px-3 pb-2 border-b-2 transition-colors ${
              activeTab === 'account' 
                ? 'border-[#3273AF]' 
                : 'border-transparent'
            }`}
          >
            <span className={`text-xl font-medium transition-colors ${
              activeTab === 'account' 
                ? 'font-bold text-[#3273AF]' 
                : 'text-[#717B8C]'
            }`}>
              Account Setting
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex flex-col gap-2 items-center px-3 pb-2 border-b-2 transition-colors ${
              activeTab === 'security' 
                ? 'border-[#3273AF]' 
                : 'border-transparent'
            }`}
          >
            <span className={`text-xl font-medium transition-colors ${
              activeTab === 'security' 
                ? 'font-bold text-[#3273AF]' 
                : 'text-[#717B8C]'
            }`}>
              Login & Security
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'account' ? <AccountSettingsForm onShowEditMedia={() => setShowEditMediaModal(true)} currentAvatar={currentAvatar} /> : <LoginSecurityForm onShowModal={() => setShowChangePasswordModal(true)} />}
      </div>

      {/* Change Password Modal - Outside the main content */}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      {/* Edit Media Modal - Outside the main content */}
      <EditMediaModal 
        isOpen={showEditMediaModal}
        onClose={() => setShowEditMediaModal(false)}
        currentAvatar={currentAvatar}
        onAvatarChange={setCurrentAvatar}
      />
    </div>
  );
};

export default ProfilePage;


