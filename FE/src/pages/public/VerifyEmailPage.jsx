import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const VerifyEmailPage = () => {
    const [message, setMessage] = useState('Verifying your email...');
    const [error, setError] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    useEffect(() => {
        // Prevent multiple calls
        if (hasVerified.current) return;
        
        const token = new URLSearchParams(location.search).get('token');
        
        console.log('Token from URL:', token);

        if (token) {
            hasVerified.current = true;
            
            const verify = async () => {
                console.log('Calling verifyEmail with token:', token);
                const response = await authService.verifyEmail(token);
                console.log('verifyEmail response:', response);
                
                if (response.success) {
                    setMessage('Email verified successfully! You can now log in.');
                    setError(false);
                } else {
                    setMessage(response.error || 'Failed to verify email. The link may be invalid or expired.');
                    setError(true);
                }
            };
            verify();
        } else {
            setMessage('Invalid verification link.');
            setError(true);
        }
    }, [location]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                <h2 className={`text-2xl font-bold mb-4 ${error ? 'text-red-600' : 'text-gray-800'}`}>
                    {error ? 'Verification Failed' : 'Email Verification'}
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                    onClick={() => navigate('/login-reader')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default VerifyEmailPage;