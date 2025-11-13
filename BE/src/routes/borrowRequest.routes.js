const express = require('express');
const router = express.Router();
const BorrowRequestController = require('../controllers/borrowRequest.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * @route   POST /api/borrow-requests
 * @desc    Tạo borrow request mới
 * @access  Reader only
 * @body    { book_id, pickup_date }
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole('reader'),
  BorrowRequestController.createBorrowRequest
);

/**
 * @route   GET /api/borrow-requests/my-requests
 * @desc    Lấy tất cả requests của reader hiện tại
 * @access  Reader only
 */
router.get(
  '/my-requests',
  authenticateToken,
  authorizeRole('reader'),
  BorrowRequestController.getMyRequests
);

/**
 * @route   GET /api/borrow-requests
 * @desc    Lấy tất cả pending requests (cho Librarian)
 * @access  Librarian only
 */
router.get(
  '/',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowRequestController.getAllPendingRequests
);

/**
 * @route   GET /api/borrow-requests/approved
 * @desc    Lấy tất cả approved requests chờ delivery (cho Librarian)
 * @access  Librarian only
 */
router.get(
  '/approved',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowRequestController.getAllApprovedRequests
);

/**
 * @route   PUT /api/borrow-requests/:id/approve
 * @desc    Approve một borrow request
 * @access  Librarian only
 */
router.put(
  '/:id/approve',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowRequestController.approveBorrowRequest
);

/**
 * @route   DELETE /api/borrow-requests/:id/reject
 * @desc    Reject một borrow request (Librarian)
 * @access  Librarian only
 * @body    { rejection_reason }
 */
router.delete(
  '/:id/reject',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowRequestController.rejectBorrowRequest
);

/**
 * @route   DELETE /api/borrow-requests/:id/cancel
 * @desc    Cancel borrow request của chính mình (Reader)
 * @access  Reader only
 */
router.delete(
  '/:id/cancel',
  authenticateToken,
  authorizeRole('reader'),
  BorrowRequestController.cancelBorrowRequest
);

module.exports = router;
