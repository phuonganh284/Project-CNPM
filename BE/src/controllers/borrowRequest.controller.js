const BorrowRequest = require('../models/borrowRequest.model');
const Copy = require('../models/copy.model');
const { formatResponse, formatError } = require('../utils/responseFormatter');
const { pool } = require('../config/database');

class BorrowRequestController {
  static async createBorrowRequest(req, res) {
    try {
      const { bookId, book_id, pickupDate, pickup_date } = req.body;
      const user_id = req.user.id;

      // Manually fetch reader_id
      const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [user_id]);
      if (readerResult.rows.length === 0) {
        return res.status(403).json(formatError('Forbidden', 'User is not a valid reader.', 403));
      }
      const reader_id = readerResult.rows[0].reader_id;

      // Accept both camelCase and snake_case
      const finalBookId = bookId || book_id;
      const finalPickupDate = pickupDate || pickup_date;

      if (!finalBookId || !finalPickupDate) {
        return res.status(400).json(
          formatError('Missing required fields', 'bookId and pickupDate are required', 400)
        );
      }

      const totalActive = await BorrowRequest.countTotalActiveRequestsAndBorrowings(reader_id);
      if (totalActive >= 5) {
        return res.status(403).json(
          formatError(
            'Borrow limit reached', 
            'You have reached the maximum limit of 5 active requests and borrowings. Please return books or cancel pending requests before creating a new request.', 
            403
          )
        );
      }

      // Check if user is already borrowing this title
      const isBorrowing = await BorrowRequest.isCurrentlyBorrowingTitle(reader_id, finalBookId);
      if (isBorrowing) {
        return res.status(400).json(
          formatError('Duplicate request', 'You are already borrowing this book', 400)
        );
      }

      // Check duplicate pending request for same book
      const hasPending = await BorrowRequest.hasPendingRequestForBook(reader_id, finalBookId);
      if (hasPending) {
        return res.status(400).json(
          formatError('Duplicate request', 'You already have a pending request for this book', 400)
        );
      }

      // Check duplicate approved request for same book
      const hasApproved = await BorrowRequest.hasApprovedRequestForBook(reader_id, finalBookId);
      if (hasApproved) {
        return res.status(400).json(
          formatError('Duplicate request', 'You already have an approved request for this book waiting for pickup', 400)
        );
      }

      // Find best available copy
      const copy = await Copy.findBestAvailableCopy(finalBookId);
      if (!copy) {
        return res.status(404).json(
          formatError('No available copies', 'This book is currently out of stock or all copies are in poor condition', 404)
        );
      }

      // Create request
      const request = await BorrowRequest.create(reader_id, copy.copy_id, finalPickupDate);

      // Combine request with copy info
      const responseData = {
        requestId: request.request_id,
        status: request.status,
        pickupDate: request.pickup_date,
        copyId: copy.copy_id,
        condition: copy.condition
      };

      return res.status(201).json(
        formatResponse(responseData, 'Borrow request created successfully')
      );

    } catch (error) {
      console.error('Error creating borrow request:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to create borrow request', 500)
      );
    }
  }

  static async getMyRequests(req, res) {
    try {
      const user_id = req.user.id;

      // Manually fetch reader_id
      const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [user_id]);
      if (readerResult.rows.length === 0) {
        return res.status(403).json(formatError('Forbidden', 'User is not a valid reader.', 403));
      }
      const reader_id = readerResult.rows[0].reader_id;

      const requests = await BorrowRequest.findByReaderId(reader_id);

      // Format response with camelCase
      return res.status(200).json(
        formatResponse(requests, 'Requests retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting my requests:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to retrieve requests')
      );
    }
  }

  static async getAllPendingRequests(req, res) {
    try {
      const requests = await BorrowRequest.findAllPending();

      return res.status(200).json(
        formatResponse(requests, 'Pending requests retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting pending requests:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to retrieve pending requests', 500)
      );
    }
  }

  static async getAllApprovedRequests(req, res) {
    try {
      const requests = await BorrowRequest.findAllApproved();

      return res.status(200).json(
        formatResponse(requests, 'Approved requests retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting approved requests:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to retrieve approved requests', 500)
      );
    }
  }

  static async approveBorrowRequest(req, res) {
    try {
      const request_id = parseInt(req.params.id);

      if (isNaN(request_id)) {
        return res.status(400).json(
          formatError('Invalid request ID', 'Request ID must be a valid number', 400)
        );
      }

      const request = await BorrowRequest.findById(request_id);
      if (!request) {
        return res.status(404).json(
          formatError('Request not found', 'Borrow request does not exist', 404)
        );
      }

      if (request.status !== 'pending') {
        return res.status(400).json(
          formatError('Request already processed', `This request has already been ${request.status}`, 400)
        );
      }

      const copy = await Copy.findById(request.copy_id);
      if (!copy || !copy.availability) {
        return res.status(400).json(
          formatError('Copy not available', 'This copy is no longer available for borrowing', 400)
        );
      }

      const approvedRequest = await BorrowRequest.approve(request_id);

      return res.status(200).json(
        formatResponse(approvedRequest, 'Borrow request approved successfully')
      );

    } catch (error) {
      console.error('Error approving borrow request:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to approve borrow request', 500)
      );
    }
  }

  static async rejectBorrowRequest(req, res) {
    try {
      const request_id = parseInt(req.params.id);
      const { rejection_reason } = req.body; 
      if (isNaN(request_id)) {
        return res.status(400).json(
          formatError('Invalid request ID', 'Request ID must be a valid number', 400)
        );
      }

      if (!rejection_reason || rejection_reason.trim() === '') {
        return res.status(400).json(
          formatError('Missing rejection reason', 'Please provide a reason for rejection', 400)
        );
      }

      const request = await BorrowRequest.findById(request_id);
      if (!request) {
        return res.status(404).json(
          formatError('Request not found', 'Borrow request does not exist', 404)
        );
      }

      if (request.status !== 'pending') {
        return res.status(400).json(
          formatError('Request already processed', `Cannot reject a request that has been ${request.status}`, 400)
        );
      }

      const rejectedRequest = await BorrowRequest.reject(request_id, rejection_reason);

      return res.status(200).json(
        formatResponse(
          { ...rejectedRequest, rejection_reason }, 
          'Borrow request rejected successfully'
        )
      );

    } catch (error) {
      console.error('Error rejecting borrow request:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to reject borrow request', 500)
      );
    }
  }

  static async cancelBorrowRequest(req, res) {
    try {
      const request_id = parseInt(req.params.id);
      const reader_id = req.user.reader_id;

      if (isNaN(request_id)) {
        return res.status(400).json(
          formatError('Invalid request ID', 'Request ID must be a valid number', 400)
        );
      }

      const request = await BorrowRequest.findById(request_id);
      if (!request) {
        return res.status(404).json(
          formatError('Request not found', 'Borrow request does not exist', 404)
        );
      }

      // Check ownership
      if (request.reader_id !== reader_id) {
        return res.status(403).json(
          formatError('Forbidden', 'You can only cancel your own requests', 403)
        );
      }

      if (request.status !== 'pending') {
        return res.status(400).json(
          formatError('Cannot cancel', `Cannot cancel a request that has been ${request.status}`, 400)
        );
      }

      const cancelledRequest = await BorrowRequest.cancel(request_id, reader_id);

      return res.status(200).json(
        formatResponse(cancelledRequest, 'Borrow request cancelled successfully')
      );

    } catch (error) {
      console.error('Error cancelling borrow request:', error);
      return res.status(500).json(
        formatError('Internal server error', error.message || 'Failed to cancel borrow request', 500)
      );
    }
  }
}

module.exports = BorrowRequestController;
