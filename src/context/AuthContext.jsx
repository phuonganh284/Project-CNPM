import React, { createContext, useState, useContext } from 'react';
// TODO: KHI CÓ BE - Uncomment dòng dưới để import axios
// import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ========================================================================
    // STATE - GIỮ NGUYÊN
    // ========================================================================
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // ========================================================================
    // KHỞI TẠO - Load user từ localStorage nếu có
    // ========================================================================
    React.useEffect(() => {
        // TODO: KHI CÓ BE - XÓA phần đọc role từ URL param (chỉ dùng để test)
        // Chỉ giữ lại phần load từ localStorage hoặc verify token với BE
        
        // Đọc role từ URL parameter để test (ví dụ: ?role=reader)
        const urlParams = new URLSearchParams(window.location.search);
        const roleFromUrl = urlParams.get('role');
        
        if (roleFromUrl && ['guest', 'reader', 'librarian'].includes(roleFromUrl)) {
            // Nếu có role trong URL, dùng nó để test
            const testUser = { 
                id: 1, 
                name: `Test ${roleFromUrl}`, 
                email: `${roleFromUrl}@test.com`,
                role: roleFromUrl 
            };
            setUser(testUser);
            localStorage.setItem('user', JSON.stringify(testUser));
            console.log(`✅ Testing as: ${roleFromUrl}`);
        } else {
            // Không có URL param, load từ localStorage
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                // Mặc định là guest nếu chưa login
                setUser({ role: 'guest' });
            }
        }
    }, []);

    // ========================================================================
    // LOGIN - SỬA KHI CÓ BE
    // ========================================================================
    const login = async (email, password) => {
        // TODO: KHI CÓ BE - Xóa phần fake user, uncomment phần API call phía dưới
        
        // TRƯỚC KHI CÓ BE (GIẢ):
        const fakeUser = {
            id: 1,
            name: 'Test User',
            email: email,
            role: 'reader' // Giả lập login thành công
        };
        setUser(fakeUser);
        localStorage.setItem('user', JSON.stringify(fakeUser));
        return { success: true };

        // SAU KHI CÓ BE (THẬT) - BỎ COMMENT CODE DƯỚI:
        /*
        try {
            setLoading(true);
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setLoading(false);
            
            return { success: true };
        } catch (error) {
            setLoading(false);
            return { success: false, error: error.response?.data?.message };
        }
        */
    };

    // ========================================================================
    // LOGOUT - SỬA KHI CÓ BE
    // ========================================================================
    const logout = () => {
        // TODO: KHI CÓ BE - Uncomment phần API call phía dưới
        
        // TRƯỚC KHI CÓ BE:
        setUser({ role: 'guest' });
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // SAU KHI CÓ BE - THÊM API CALL:
        /*
        try {
            await axios.post('/api/auth/logout');
            setUser({ role: 'guest' });
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Logout error:', error);
        }
        */
    };

    // ========================================================================
    // CHANGE ROLE - CHỈ DÙNG TEST, XÓA KHI CÓ BE
    // ========================================================================
    // TODO: KHI CÓ BE - XÓA TOÀN BỘ FUNCTION NÀY
    const changeRole = (newRole) => {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log(`✅ Role changed to: ${newRole}`);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        changeRole,  // TODO: KHI CÓ BE - XÓA DÒNG NÀY (chỉ dùng để test)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
