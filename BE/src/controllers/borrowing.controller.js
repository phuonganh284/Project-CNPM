const Borrowing = require('../models/borrowing.model');
const { formatResponse, formatError } = require('../utils/responseFormatter');
const { pool } = require('../config/database');

const BorrowingController = {

  async confirmDelivery(req, res) {
    try {
      const { requestId } = req.params;

      if (!requestId) {
        return res.status(400).json(
          formatError(null, 'Request ID is required', 400)
        );
      }

      const borrowing = await Borrowing.createFromRequest(parseInt(requestId));

      return res.status(201).json(
        formatResponse(borrowing, 'Book delivery confirmed. Borrowing record created successfully.')
      );
    } catch (error) {
      console.error('Error confirming delivery:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json(formatError(error, error.message, 404));
      }
      if (error.message.includes('must be approved') ||
        error.message.includes('already exists')) {
        return res.status(400).json(formatError(error, error.message, 400));
      }
      if (error.message.includes('limit exceeded')) {
        return res.status(403).json(formatError(error, error.message, 403));
      }

      return res.status(500).json(
        formatError(error, 'Failed to confirm delivery', 500)
      );
    }
  },

  async getMyBorrowings(req, res) {
    try {
      const user_id = req.user.id;
      const { active } = req.query; // ?active=true to get only active borrowings

      // Manually fetch reader_id
      const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [user_id]);
      if (readerResult.rows.length === 0) {
        return res.status(403).json(formatError('Forbidden', 'User is not a valid reader.', 403));
      }
      const reader_id = readerResult.rows[0].reader_id;

      let borrowings = await Borrowing.findActive(reader_id);

      return res.status(200).json(
        formatResponse(borrowings, 'Borrowings retrieved successfully')
      );
    } catch (error) {
      console.error('Error getting borrowings:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve borrowings', 500)
      );
    }
  },

  async getAllBorrowings(req, res) {
    try {
      const { active } = req.query; // ?active=true to get only active borrowings

      let borrowings;
      if (active === 'true') {
        borrowings = await Borrowing.findActive();
      } else {
        // For all borrowings, we need a new method - for now return active only
        borrowings = await Borrowing.findActive();
      }

      return res.status(200).json(
        formatResponse(borrowings, 'All borrowings retrieved successfully')
      );
    } catch (error) {
      console.error('Error getting all borrowings:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve borrowings', 500)
      );
    }
  },

  async renewBorrowing(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      // Manually fetch reader_id
      const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [user_id]);
      if (readerResult.rows.length === 0) {
        return res.status(403).json(formatError('Forbidden', 'User is not a valid reader.', 403));
      }
      const reader_id = readerResult.rows[0].reader_id;

      if (!id) {
        return res.status(400).json(
          formatError(null, 'Borrowing ID is required', 400)
        );
      }

      const borrowing = await Borrowing.renew(parseInt(id), reader_id);

      return res.status(200).json(
        formatResponse(borrowing, 'Borrowing renewed successfully')
      );
    } catch (error) {
      console.error('Error renewing borrowing:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json(formatError(error, error.message, 404));
      }
      if (error.message.includes('only renew approved') ||
        error.message.includes('limit reached') ||
        error.message.includes('overdue') ||
        error.message.includes('must be in the future') ||
        error.message.includes('more than 14 days')) {
        return res.status(400).json(formatError(error, error.message, 400));
      }

      return res.status(500).json(
        formatError(error, 'Failed to renew borrowing', 500)
      );
    }
  },

  async getBorrowingById(req, res) {
    try {
      const { id } = req.params;
      const borrowId = parseInt(id);

      if (!id || isNaN(borrowId)) {
        return res.status(400).json(
          formatError(null, 'A valid Borrowing ID is required', 400)
        );
      }

      const borrowing = await Borrowing.findById(borrowId);

      if (!borrowing) {
        return res.status(404).json(
          formatError(null, 'Borrowing record not found', 404)
        );
      }

      return res.status(200).json(
        formatResponse(borrowing, 'Borrowing retrieved successfully')
      );
    } catch (error) {
      console.error('Error getting borrowing:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve borrowing', 500)
      );
    }
  },

  // ==================== RETURN WORKFLOW ====================

  async createReturnRequest(req, res) {
    try {
      const { borrowId: id } = req.params; // borrow_id
      // Make returnedCondition optional, default to 100
      const { returnedCondition = 100, damageDetails } = req.body;
      const user_id = req.user.id;

      // Manually fetch reader_id
      const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [user_id]);
      if (readerResult.rows.length === 0) {
        return res.status(403).json(formatError('Forbidden', 'User is not a valid reader.', 403));
      }
      const reader_id = readerResult.rows[0].reader_id;

      if (!id) {
        return res.status(400).json(
          formatError(null, 'Borrowing ID is required', 400)
        );
      }

      const returnRequest = await Borrowing.createReturnRequest(
        parseInt(id),
        reader_id,
        returnedCondition,
        damageDetails
      );

      return res.status(201).json(
        formatResponse(returnRequest, 'Return request created successfully')
      );
    } catch (error) {
      console.error('Error creating return request:', error);

      if (error.message.includes('not found') || error.message.includes('does not belong')) {
        return res.status(404).json(formatError(error, error.message, 404));
      }
      if (error.message.includes('Cannot create') ||
        error.message.includes('already exists')) {
        return res.status(400).json(formatError(error, error.message, 400));
      }

      return res.status(500).json(
        formatError(error, 'Failed to create return request', 500)
      );
    }
  },

  async getAllReturnRequests(req, res) {
    try {
      const { status } = req.query; // ?status=pending|assessed|completed

      const requests = await Borrowing.getAllReturnRequests(status);

      return res.status(200).json(
        formatResponse(requests, 'Return requests retrieved successfully')
      );
    } catch (error) {
      console.error('Error getting return requests:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve return requests', 500)
      );
    }
  },

  async assessReturnCondition(req, res) {
    try {
      const { returnId: id } = req.params; // return_id
      const { assessedCondition, damagePercentage, assessmentNotes, overdueRate = 1 } = req.body;
      
      const _debug = {
        message: "This is a debug response to check validation.",
        receivedBody: req.body,
        extractedOverdueRate: overdueRate,
        isRateTooHigh: overdueRate > 5,
        validationShouldBlock: (typeof overdueRate !== 'number' || overdueRate < 0 || overdueRate > 5),
      };

      // --- SERVER-SIDE VALIDATION ---
      if (!id) {
        return res.status(400).json(formatError(null, 'Return request ID is required', 400));
      }
      if (!assessedCondition) {
        return res.status(400).json(formatError(null, 'assessedCondition is required', 400));
      }

      // Temporarily bypass the validation block for debugging, but log if it would have triggered
      // if (typeof overdueRate !== 'number' || overdueRate < 0 || overdueRate > 5) {
      //   return res.status(400).json(formatError(null, 'Overdue rate must be a number between 0 and 5.', 400));
      // }

      // Validate damagePercentage based on assessedCondition
      const damageRanges = {
        'OK': [0, 0], 'MINOR': [5, 10], 'MODERATE': [20, 40], 'SEVERE': [60, 80], 'LOST': [100, 100]
      };
      const range = damageRanges[assessedCondition];
      if (!range) {
        return res.status(400).json(formatError(null, 'Invalid assessedCondition', 400));
      }
      if (damagePercentage === undefined || damagePercentage < range[0] || damagePercentage > range[1]) {
        return res.status(400).json(formatError(null, `damagePercentage must be between ${range[0]}% and ${range[1]}% for ${assessedCondition}`, 400));
      }

      // --- Call Model ---
      const updatedRequest = await Borrowing.assessReturnCondition(parseInt(id), {
        assessed_condition: assessedCondition,
        damage_percentage: damagePercentage,
        assessment_notes: assessmentNotes,
        overdue_rate: overdueRate,
      });

      const responsePayload = formatResponse(updatedRequest, 'Return condition assessed successfully');
      responsePayload._debug = _debug; // Add debug info to the final response

      return res.status(200).json(responsePayload);

    } catch (error) {
      console.error('Error assessing return condition:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json(formatError(error, error.message, 404));
      }
      if (error.message.includes('must be') || error.message.includes('is required') || error.message.includes('Cannot assess')) {
        return res.status(400).json(formatError(error, error.message, 400));
      }

      return res.status(500).json(
        formatError(error, 'Failed to assess return condition', 500)
      );
    }
  },

  async completeReturn(req, res) {
    try {
      const { returnId: id } = req.params; // return_request_id

      if (!id) {
        return res.status(400).json(
          formatError(null, 'Return request ID is required', 400)
        );
      }

      const completedRequest = await Borrowing.completeReturn(parseInt(id));

      return res.status(200).json(
        formatResponse(completedRequest, 'Book return completed successfully')
      );
    } catch (error) {
      console.error('Error completing return:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json(formatError(error, error.message, 404));
      }
      if (error.message.includes('Cannot complete') ||
        error.message.includes('Must be assessed')) {
        return res.status(400).json(formatError(error, error.message, 400));
      }

      return res.status(500).json(
        formatError(error, 'Failed to complete book return', 500)
      );
    }
  },

  async getBorrowingHistory(req, res) {
    try {
      const user_id = req.user?.id;

      if (!user_id || isNaN(parseInt(user_id))) {
        return res.status(400).json(formatError(
          { user: req.user, userIdAttempted: user_id },
          'Invalid user identifier in token.',
          400
        ));
      }

      // Manually fetch reader_id
      const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [user_id]);
      if (readerResult.rows.length === 0) {
        // This is not an error, it just means the user (e.g. a librarian) is not a reader
        // or a new reader has no history. Return an empty array.
        return res.status(200).json(
          formatResponse([], 'No borrowing history found for this user.')
        );
      }
      const reader_id = readerResult.rows[0].reader_id;

      const history = await Borrowing.getBorrowingHistory(reader_id);
      return res.status(200).json(
        formatResponse(history, 'Borrowing history retrieved successfully')
      );
    } catch (error) {
      console.error('Error getting borrowing history:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve borrowing history', 500)
      );
    }
  },

  async getBorrowingHistoryForReader(req, res) {
    try {
      const { readerId } = req.params;

      if (!readerId || isNaN(parseInt(readerId))) {
        return res.status(400).json(formatError(null, 'A valid user id is required', 400));
      }

      // Map provided user_id to reader_id
      const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [parseInt(readerId)]);
      if (readerResult.rows.length === 0) {
        return res.status(200).json(formatResponse([], 'No borrowing history found for this user.'));
      }
      const reader_id = readerResult.rows[0].reader_id;

      const history = await Borrowing.getBorrowingHistory(reader_id);
      return res.status(200).json(formatResponse(history, 'Borrowing history retrieved successfully'));
    } catch (error) {
      console.error('Error getting borrowing history for reader:', error);
      return res.status(500).json(formatError(error, 'Failed to retrieve borrowing history', 500));
    }
  },
};

module.exports = BorrowingController;
