import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
            try {
                return JSON.parse(savedUser);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                return { role: 'guest' };
            }
        }
        return { role: 'guest' };
    });
    const [loading, setLoading] = useState(false);

    // Register function using real API
    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/register', userData);
            
            if (response.data.success) {
                return { success: true, message: response.data.message };
            } else {
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed. Please try again.' 
            };
        } finally {
            setLoading(false);
        }
    };

    // Login function using real API
    const login = async (email, password, role) => {
        try {
            setLoading(true);
            
            // Choose endpoint based on role
            const endpoint = role === 'librarian' ? '/auth/librarian/login' : '/auth/reader/login';
            const response = await api.post(endpoint, { email, password });

            if (response.data.success) {
                const { token, user: userData } = response.data.data;
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                
                return { success: true };
            } else {
                return { success: false, error: response.data.message || 'Login failed' };
            }
        } catch (error) {
            // Don't log to console for expected authentication errors
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                console.error('Login error:', error);
            }
            return { 
                success: false, 
                error: error.response?.data?.message || 'Invalid email or password' 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser({ role: 'guest' });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Wrapper functions for backward compatibility
    const loginReader = async (email, password) => {
        return await login(email, password, 'reader');
    };

    const loginLibrarian = async (email, password) => {
        return await login(email, password, 'librarian');
    };

    const value = {
        user,
        loading,
        login,
        loginReader,
        loginLibrarian,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
