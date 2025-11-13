const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/borrowing.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * @route   POST /api/borrowings/confirm-delivery/:requestId
 * @desc    Librarian confirms book delivery - Create borrowing record from approved request
 * @access  Librarian only
 */
router.post('/confirm-delivery/:requestId', 
  authenticateToken,
  authorizeRole('librarian'),
  BorrowingController.confirmDelivery
);

/**
 * @route   GET /api/borrowings/my-borrowings
 * @desc    Get all borrowings for authenticated reader
 * @access  Reader only
 * @query   ?active=true (optional) - Get only active borrowings
 */
router.get('/my-borrowings',
  authenticateToken,
  authorizeRole('reader'),
  BorrowingController.getMyBorrowings
);

/**
 * @route   PUT /api/borrowings/:id/renew
 * @desc    Renew/extend borrowing
 * @access  Reader only
 */
router.put('/:id/renew',
  authenticateToken,
  authorizeRole('reader'),
  BorrowingController.renewBorrowing
);

/**
 * @route   GET /api/borrowings/:id
 * @desc    Get borrowing details by ID
 * @access  Reader/Librarian
 */
router.get('/:id',
  authenticateToken,
  BorrowingController.getBorrowingById
);

/**
 * @route   GET /api/borrowings
 * @desc    Get all borrowings (librarian view)
 * @access  Librarian only
 * @query   ?active=true (optional) - Get only active borrowings
 */
router.get('/',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowingController.getAllBorrowings
);

// ==================== RETURN WORKFLOW ROUTES ====================

/**
 * @route   POST /api/borrowings/:borrowId/return-request
 * @desc    Reader creates return request for a borrowing
 * @access  Reader only
 */
router.post('/:borrowId/return-request',
  authenticateToken,
  authorizeRole('reader'),
  BorrowingController.createReturnRequest
);

/**
 * @route   GET /api/borrowings/return-requests
 * @desc    Get all return requests (librarian view)
 * @access  Librarian only
 * @query   ?status=pending|assessed|completed (optional)
 */
router.get('/return-requests',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowingController.getAllReturnRequests
);

/**
 * @route   PUT /api/borrowings/return-requests/:returnId/assess
 * @desc    Librarian assesses returned book condition and calculates fees
 * @access  Librarian only
 */
router.put('/return-requests/:returnId/assess',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowingController.assessReturnCondition
);

/**
 * @route   POST /api/borrowings/return-requests/:returnId/complete
 * @desc    Complete book return (after assessment and payment)
 * @access  Librarian only
 */
router.post('/return-requests/:returnId/complete',
  authenticateToken,
  authorizeRole('librarian'),
  BorrowingController.completeReturn
);

/**
 * @route   GET /api/borrowings/history
 * @desc    Get complete borrowing history for authenticated reader
 * @access  Reader only
 */
router.get('/history',
  authenticateToken,
  authorizeRole('reader'),
  BorrowingController.getBorrowingHistory
);

module.exports = router;
