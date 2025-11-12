const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database.js');
const { generateToken: generateVerificationToken, generateCode, getTokenExpires } = require('../utils/tokenGenerator');
const { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } = require('../utils/emailService');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.user_id,
            email: user.email,
            role: user.role,
            name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const register = async (req, res) => {
    const { email, password, username, name, full_name, role } = req.body;
    

    const displayName = full_name || name;
    const userRole = role || 'reader';
    
    if (!email || !password || !username || !displayName) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: email, password, username, and name are required'
        });
    }
    
    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }
    
    if (!['reader', 'librarian'].includes(userRole)) {
        return res.status(400).json({
            success: false,
            message: 'Role must be either "reader" or "librarian"'
        });
    }
    
    let client;
    
    try {
        console.log('CHECK OVERLAPPED EMAIL')
        client = await pool.connect();
        await client.query('BEGIN');
        
        const existingEmail = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log(existingEmail.rows)
        if (existingEmail.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }



        const existingUsername = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUsername.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Username already in use'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate verification token and code
        const verificationToken = generateVerificationToken();
        const verificationCode = generateCode();
        const tokenExpires = getTokenExpires();

        const userResult = await client.query(
            `INSERT INTO users (username, email, password, name, status, is_verified, verification_token, verification_expires) 
            VALUES ($1, $2, $3, $4, 'active', false, $5, $6) 
            RETURNING user_id, username, email, name, status, profile_picture, is_verified`,
            [username, email, hashedPassword, displayName, verificationToken, tokenExpires]
        );

        const user = userResult.rows[0];

        // Insert into readers or librarians table based on role
        if (userRole === 'reader') {
            await client.query(
                'INSERT INTO readers (user_id) VALUES ($1)',
                [user.user_id]
            );
        } else if (userRole === 'librarian') {
            await client.query(
                'INSERT INTO librarians (user_id) VALUES ($1)',
                [user.user_id]
            );
        }

        await client.query('COMMIT');

        // Send verification email
        try {
            await sendVerificationEmail(email, displayName, verificationToken, verificationCode);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Don't fail registration if email fails
        }

        // Add role for token generation
        user.role = userRole;

        res.status(201).json({
            success: true,
            message: 'Registered successfully! Please check email to validate your account',
            data: {
                user: {
                    id: user.user_id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: userRole,
                    status: user.status,
                    profile_picture: user.profile_picture,
                    is_verified: user.is_verified
                }
            }
        });
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error('Register error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    } finally {
        if (client) {
            client.release();
        }
    }
};

// Reader login
const loginReader = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const query = `
            SELECT u.*, 'reader' as role 
            FROM users u 
            JOIN readers r ON u.user_id = r.user_id 
            WHERE u.email = $1
        `;

        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = result.rows[0];

        // Check if email is verified
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }

        if (user.status === 'banned') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.user_id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    profile_picture: user.profile_picture,
                    borrow_count: user.borrow_count
                },
                token
            }
        });
    } catch (error) {
        console.error('Reader login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Librarian login
const loginLibrarian = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const query = `
            SELECT u.*, 'librarian' as role 
            FROM users u 
            JOIN librarians l ON u.user_id = l.user_id 
            WHERE u.email = $1
        `;

        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = result.rows[0];

        // Check if email is verified
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: 'Vui lòng xác nhận email trước khi đăng nhập'
            });
        }

        if (user.status === 'banned') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.user_id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    profile_picture: user.profile_picture,
                    borrow_count: user.borrow_count
                },
                token
            }
        });
    } catch (error) {
        console.error('Librarian login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

const login = async (req, res) => {
    const { email, password, role } = req.body;
    
    if (role === 'reader') {
        return loginReader(req, res);
    } else if (role === 'librarian') {
        return loginLibrarian(req, res);
    } else {
        return res.status(400).json({
            success: false,
            message: 'Invalid role specified'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, username, email, name, status, profile_picture, borrow_count FROM users WHERE user_id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Get profile error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    try {
        const result = await pool.query(
            'SELECT password FROM users WHERE user_id = $1',
            [req.user.id]
        );

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await pool.query(
            'UPDATE users SET password = $1 WHERE user_id = $2',
            [hashedPassword, req.user.id]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: true,
                message: 'If that email exists, a reset link has been sent'
            });
        }

        const resetToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Reset token:', resetToken);

        res.json({
            success: true,
            message: 'Password reset email sent',
            resetToken
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2',
            [hashedPassword, decoded.email]
        );

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
        });
    }
};

// Verify email
const verifyEmail = async (req, res) => {
    const { token, code } = req.body;

    if (!token && !code) {
        return res.status(400).json({
            success: false,
            message: 'Token or OTP is compulsory'
        });
    }

    try {
        let query;
        let params;

        if (token) {
            query = `
                SELECT user_id, email, name, is_verified, verification_expires 
                FROM users 
                WHERE verification_token = $1
            `;
            params = [token];
        } else {
            query = `
                SELECT user_id, email, name, is_verified, verification_expires 
                FROM users 
                WHERE verification_token = $1
            `;
            params = [code];
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Token'
            });
        }

        const user = result.rows[0];

        // Check if already verified
        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: 'Email has been verified'
            });
        }

        // Check if token expired
        if (new Date() > new Date(user.verification_expires)) {
            return res.status(400).json({
                success: false,
                message: 'Token expired. Please request another confirmation email.'
            });
        }

        // Update user to verified
        await pool.query(
            `UPDATE users 
            SET is_verified = true, verification_token = NULL, verification_expires = NULL 
            WHERE user_id = $1`,
            [user.user_id]
        );

        res.json({
            success: true,
            message: 'Email is verified successfully',
            data: {
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    is_verified: true
                }
            }
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification'
        });
    }
};

// Resend verification email
const resendVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email là bắt buộc'
        });
    }

    try {
        const result = await pool.query(
            'SELECT user_id, email, name, is_verified FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: true,
                message: 'Confirmation email has been resent'
            });
        }

        const user = result.rows[0];

        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: 'Email has been verified'
            });
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken();
        const verificationCode = generateCode();
        const tokenExpires = getTokenExpires();

        await pool.query(
            `UPDATE users 
            SET verification_token = $1, verification_expires = $2 
            WHERE user_id = $3`,
            [verificationToken, tokenExpires, user.user_id]
        );

        try {
            await sendVerificationEmail(user.email, user.name, verificationToken, verificationCode);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            return res.status(500).json({
                success: false,
                message: "Can't send email. Please try again later."
            });
        }

        res.json({
            success: true,
            message: 'Confirmation email has been resent'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is compulsory'
        });
    }

    try {
        const result = await pool.query(
            'SELECT user_id, email, name FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: true,
                message: 'An reset password email has been sent, please check your mailbox.'
            });
        }

        const user = result.rows[0];

        const resetToken = generateVerificationToken();
        const resetCode = generateCode();
        const tokenExpires = getTokenExpires();

        await pool.query(
            `UPDATE users 
            SET reset_token = $1, reset_token_expires = $2 
            WHERE user_id = $3`,
            [resetToken, tokenExpires, user.user_id]
        );

        try {
            await sendPasswordResetEmail(user.email, user.name, resetToken, resetCode);
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
        }

        res.json({
            success: true,
            message: 'An reset password email has been sent, please check your mailbox.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Reset password with token (updated)
const resetPasswordWithToken = async (req, res) => {
    const { token, code, new_password } = req.body;

    if (!new_password) {
        return res.status(400).json({
            success: false,
            message: 'Mật khẩu mới là bắt buộc'
        });
    }

    if (!token && !code) {
        return res.status(400).json({
            success: false,
            message: 'Token hoặc mã reset là bắt buộc'
        });
    }

    // Validate password length
    if (new_password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự'
        });
    }

    try {
        let query;
        let params;

        if (token) {
            query = `
                SELECT user_id, email, name, reset_token_expires 
                FROM users 
                WHERE reset_token = $1
            `;
            params = [token];
        } else {
            query = `
                SELECT user_id, email, name, reset_token_expires 
                FROM users 
                WHERE reset_token = $1
            `;
            params = [code];
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }

        const user = result.rows[0];

        // Check if token expired
        if (new Date() > new Date(user.reset_token_expires)) {
            return res.status(400).json({
                success: false,
                message: 'Token đã hết hạn. Vui lòng yêu cầu reset lại.'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        // Update password and clear reset token
        await pool.query(
            `UPDATE users 
            SET password = $1, reset_token = NULL, reset_token_expires = NULL 
            WHERE user_id = $2`,
            [hashedPassword, user.user_id]
        );

        // Send notification email
        try {
            await sendPasswordChangedEmail(user.email, user.name);
        } catch (emailError) {
            console.error('Failed to send password changed email:', emailError);
        }

        res.json({
            success: true,
            message: 'Mật khẩu đã được reset thành công'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Change password (updated with email notification)
const changePasswordWithNotification = async (req, res) => {
    console.log('User object from token:', req.user);
    console.log('Request body:', req.body);
    const { old_password, new_password, currentPassword } = req.body;
    const actual_old_password = old_password || currentPassword;
    
    if (!actual_old_password || !new_password) {
        return res.status(400).json({
            success: false,
            message: 'Mật khẩu cũ và mật khẩu mới là bắt buộc'
        });
    }

    // Validate password length
    if (new_password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
        });
    }

    try {
        const result = await pool.query(
            'SELECT user_id, email, name, password FROM users WHERE user_id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        // Verify old password
        const isPasswordValid = await bcrypt.compare(actual_old_password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu cũ không đúng'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        // Update password
        await pool.query(
            'UPDATE users SET password = $1 WHERE user_id = $2',
            [hashedPassword, user.user_id]
        );

        // Send notification email
        try {
            await sendPasswordChangedEmail(user.email, user.name);
        } catch (emailError) {
            console.error('Failed to send password changed email:', emailError);
        }

        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    register,
    login,
    loginReader,
    loginLibrarian,
    getProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPasswordWithToken,
    changePasswordWithNotification
};