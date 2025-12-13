import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

// Input Field Component
const InputField = ({ label, id, type = "text", placeholder, value, readOnly = false, children }) => {
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
          value={value}
          readOnly={readOnly}
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
          className={`w-full h-12 p-4 pr-12 bg-[#FAFBFC] border rounded-lg text-[#8D98AA] focus:outline-none ${error ? 'border-red-500 focus:border-red-500' : 'border-[#E0E4EC] focus:border-[#3273AF]'
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
    <div className="fixed top-[108px] left-[304px] right-[26px] bottom-0 flex items-center justify-center z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
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
  const [loading, setLoading] = useState(false);

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
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
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

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            new_password: formData.newPassword
          })
        });

        const data = await response.json();

        if (data.success) {
          setIsCompleted(true);
          // Reset form data
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          setErrors({ currentPassword: data.message || 'Failed to change password' });
        }
      } catch (error) {
        console.error('Password change error:', error);
        setErrors({ currentPassword: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setIsCompleted(false);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
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
    <div className="fixed top-[108px] left-[304px] right-[26px] bottom-0 flex items-center justify-center z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
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
                  onClick={() => {
                    window.location.href = '/send-mail-to-reset-pass';
                    onClose();
                  }}
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
                disabled={loading}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-[#3273AF] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save'}
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

// Edit Profile Modal Component
const EditProfileModal = ({ isOpen, onClose, onSave, currentProfile }) => {
  const [formData, setFormData] = useState(currentProfile || {});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(currentProfile || {});
    }
  }, [isOpen, currentProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setApiError(null);
    setSaving(true);
    try {
      // Call backend to update profile
      const res = await authService.updateProfile(formData);
      if (res.success) {
        const updated = res.data || {};
        onSave(updated);
        onClose();
      } else {
        setApiError(res.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setApiError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(currentProfile || {});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-[108px] left-[304px] right-[26px] bottom-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h2>

        <div className="flex flex-col gap-6">
          {/* Hàng 1: Tên, Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#4C535F]">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF]"
                placeholder="Enter full name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#4C535F]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF]"
                placeholder="Enter email"
              />
            </div>
          </div>

          {/* Hàng 2: Username, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#4C535F]">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF]"
                placeholder="Enter username"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#4C535F]">Phone number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8D98AA]">+1</span>
                <div className="absolute left-12 top-1/2 -translate-y-1/2 h-5 w-px bg-[#E0E4EC]"></div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full h-12 pl-16 pr-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF]"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-[#4C535F]">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] focus:outline-none focus:border-[#3273AF] resize-none"
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-24 h-10 bg-[#3273AF] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="w-24 h-10 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Cancel
            </button>
          </div>
          {apiError && (
            <div className="mt-3 text-sm text-red-500 text-center">{apiError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Account Settings Form Component
function AccountSettingsForm({ onShowEditMedia, onShowEditProfile, currentAvatar, profileData }) {
  // Avatar URL - sử dụng ảnh hiện tại hoặc man 1.svg mặc định
  const avatarUrl = currentAvatar || "/man%201.svg";

  return (
    <div className="flex flex-col gap-8">


      {/* Form Fields - Read Only */}
      <div className="flex flex-col gap-8">
        {/* Hàng 1: Tên, Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-[#4C535F]">Full name</label>
            <div className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA]">
              {profileData?.name || ''}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-[#4C535F]">Email</label>
            <div className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA]">
              {profileData?.email || ''}
            </div>
          </div>
        </div>

        {/* Hàng 2: Username, Số điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-[#4C535F]">Username</label>
            <div className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA]">
              {profileData?.username || ''}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-[#4C535F]">Phone number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8D98AA]">+1</span>
              <div className="absolute left-12 top-1/2 -translate-y-1/2 h-5 w-px bg-[#E0E4EC]"></div>
              <div className="w-full h-12 pl-16 pr-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA] flex items-center">
                {profileData?.phone || ''}
              </div>
            </div>
          </div>
        </div>

        {/* Hàng 3: Bio */}
        <div>
          <label className="text-base font-medium text-[#4C535F] mb-2 block">Bio</label>
          <div className="w-full h-24 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#8D98AA]">
            {profileData?.bio || ''}
          </div>
        </div>

        {/* Nút Edit Profile */}
        <div>
          <button
            onClick={onShowEditProfile}
            disabled={!profileData}
            className="w-48 h-12 bg-[#3273AF] text-white text-lg font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Login & Security Form Component
function LoginSecurityForm({ onShowModal, profileData }) {
  const navigate = useNavigate();

  // Sử dụng dữ liệu từ profileData (đã được lấy từ user đang đăng nhập)
  const librarian = {
    username: profileData?.username || '',
    email: profileData?.email || '',
    password: 'password123' // Không hiển thị password thật vì lý do bảo mật
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Fixed Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-[#4C535F]">Username</label>
          <InputField
            type="text"
            value={librarian.username}
            readOnly
            className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#4C535F]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-[#4C535F]">Email</label>
          <InputField
            type="email"
            value={librarian.email}
            readOnly
            className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#4C535F]"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-base font-medium text-[#4C535F]">Password</label>
          <InputField
            type="password"
            value={librarian.password}
            readOnly
            className="w-full h-12 p-4 bg-[#FAFBFC] border border-[#E0E4EC] rounded-lg text-[#4C535F]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate('/send-mail-to-reset-pass')}
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditMediaModal, setShowEditMediaModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('/man%201.svg');

  // Profile data will be fetched from backend
  const [profileData, setProfileData] = useState(null);

  // Fetch profile on mount / when auth user changes
  React.useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        if (res.success && mounted) {
          const data = res.data || {};
          setProfileData(data);
          // set avatar if provided by API (camelCase or snake_case fallback)
          const avatar = data.profilePicture || data.profile_picture || '/man%201.svg';
          setCurrentAvatar(avatar);
        } else if (mounted) {
          // fallback empty object to avoid uncontrolled rendering
          setProfileData({});
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        if (mounted) setProfileData({});
      }
    };

    fetchProfile();

    return () => { mounted = false; };
  }, [user?.email]);

  const handleSaveProfile = (newData) => {
    setProfileData(newData);
  };

  return (
    <div className="p-6 min-h-screen relative">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Profile</h2>

      <div className="bg-white rounded-lg shadow p-8 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-3 border-b-2 border-[#E0E4EC] mb-8">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex flex-col gap-2 items-center px-3 pb-2 border-b-2 transition-colors ${activeTab === 'account'
              ? 'border-[#3273AF]'
              : 'border-transparent'
              }`}
          >
            <span className={`text-xl font-medium transition-colors ${activeTab === 'account'
              ? 'font-bold text-[#3273AF]'
              : 'text-[#717B8C]'
              }`}>
              Account Setting
            </span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex flex-col gap-2 items-center px-3 pb-2 border-b-2 transition-colors ${activeTab === 'security'
              ? 'border-[#3273AF]'
              : 'border-transparent'
              }`}
          >
            <span className={`text-xl font-medium transition-colors ${activeTab === 'security'
              ? 'font-bold text-[#3273AF]'
              : 'text-[#717B8C]'
              }`}>
              Login & Security
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'account' ? (
          <AccountSettingsForm
            onShowEditMedia={() => setShowEditMediaModal(true)}
            onShowEditProfile={() => setShowEditProfileModal(true)}
            currentAvatar={currentAvatar}
            profileData={profileData}
          />
        ) : (
          <LoginSecurityForm
            onShowModal={() => setShowChangePasswordModal(true)}
            profileData={profileData}
          />
        )}
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

      {/* Edit Profile Modal - Outside the main content */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        onSave={handleSaveProfile}
        currentProfile={profileData}
      />
    </div>
  );
};

export default ProfilePage;