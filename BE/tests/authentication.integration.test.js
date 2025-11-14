const request = require('supertest');
const app = require('../src/server');
const { pool } = require('../src/config/database');
const bcrypt = require('bcryptjs');

// Mock the email service to prevent real emails from being sent during tests
jest.mock('../src/utils/emailService', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
  sendPasswordChangedEmail: jest.fn().mockResolvedValue(),
}));

describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test User',
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'reader',
  };

  // Trước khi tất cả các test trong file này chạy, hãy dọn dẹp người dùng cũ (nếu có)
  beforeAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  });

  // Sau khi tất cả các test chạy xong, dọn dẹp người dùng đã tạo
  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    // await pool.end(); // DO NOT END THE POOL IN TESTS
  });

  describe('POST /api/auth/register', () => {
    it('Test Case 1: should register a new user successfully with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('user');
      // Token is no longer sent on register, user must verify email first
      // expect(res.body.data).toHaveProperty('token'); 
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.password).toBeUndefined(); // Quan trọng: Mật khẩu không bao giờ được trả về
    });

    it('Test Case 2: should fail to register a user with an email that already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser); // Gửi lại cùng thông tin

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Email already in use');
    });
  });

  describe('POST /api/auth/reader/login', () => {
    // For login tests, we need to manually verify the user first, 
    // as the login logic requires a verified email.
    beforeAll(async () => {
      await pool.query("UPDATE users SET is_verified = true WHERE email = $1", [testUser.email]);
    });

    it('Test Case 3: should log in a registered user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/reader/login') // Use the specific reader login route
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('Test Case 4: should fail to log in a user with an incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/reader/login') // Use the specific reader login route
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });
});
