const nodemailer = require('nodemailer');

// Config transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASSWORD // App password (not regular password)
  }
});

// Gửi email xác nhận đăng ký
const sendVerificationEmail = async (email, name, token, code) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác nhận đăng ký tài khoản',
    html: `
      <h2>Xin chào ${name},</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản Library Management System.</p>
      <p>Vui lòng click link dưới đây để xác nhận email:</p>
      <a href="${verifyUrl}" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Xác nhận email
      </a>
      <p>Hoặc nhập mã xác nhận: <strong>${code}</strong></p>
      <p>Link có hiệu lực trong 15 phút.</p>
      <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Gửi email reset password
const sendPasswordResetEmail = async (email, name, token, code) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset mật khẩu',
    html: `
      <h2>Xin chào ${name},</h2>
      <p>Bạn đã yêu cầu reset mật khẩu.</p>
      <p>Click link dưới đây để reset:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
        Reset mật khẩu
      </a>
      <p>Hoặc nhập mã: <strong>${code}</strong></p>
      <p>Link có hiệu lực trong 15 phút.</p>
      <p>Nếu bạn không yêu cầu reset, vui lòng bỏ qua email này.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Gửi email thông báo mật khẩu đã đổi
const sendPasswordChangedEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Mật khẩu đã được thay đổi',
    html: `
      <h2>Xin chào ${name},</h2>
      <p>Mật khẩu tài khoản của bạn vừa được thay đổi.</p>
      <p>Nếu không phải bạn, vui lòng liên hệ quản trị viên ngay.</p>
      <p>Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail
};
