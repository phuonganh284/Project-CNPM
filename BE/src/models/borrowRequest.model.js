const { pool } = require('../config/database');
const Notification = require('./notification.model');

class BorrowRequest {

    static async create(reader_id, copy_id, pickup_date, request_date = null) {

        if (!reader_id || !copy_id || !pickup_date) {
            throw new Error('Missing required fields: reader_id, copy_id, pickup_date');
        }

        const pickupDateObj = new Date(pickup_date);
        const requestDateObj = request_date ? new Date(request_date) : new Date();
        
        if (isNaN(pickupDateObj.getTime())) {
            throw new Error('Invalid pickup_date format');
        }

        if (pickupDateObj <= requestDateObj) {
            throw new Error('Pickup date must be after request date');
        }

        const maxPickupDate = new Date(requestDateObj);
        maxPickupDate.setDate(maxPickupDate.getDate() + 14);
        if (pickupDateObj > maxPickupDate) {
            throw new Error('Pickup date cannot be more than 14 days from now');
        }

        const query = `
            INSERT INTO borrow_requests (
                reader_id, 
                copy_id, 
                pickup_date, 
                request_date, 
                status
            )
            VALUES ($1, $2, $3, COALESCE($4, NOW()), 'pending')
            RETURNING 
                request_id,
                reader_id,
                copy_id,
                pickup_date,
                request_date,
                status
        `;
        
        try {
            const result = await pool.query(query, [reader_id, copy_id, pickup_date, request_date]);
            const newRequest = result.rows[0];
            
           
            try {
                const fullRequest = await this.findById(newRequest.request_id);
                
                const pickupDateFormatted = new Date(fullRequest.pickup_date)
                    .toLocaleDateString('en-GB')
                    .replace(/\//g, '-');
                
                await Notification.notifyLibrariansNewRequest(
                    fullRequest.request_id,
                    fullRequest.reader_name,
                    fullRequest.reader_email,
                    fullRequest.title,
                    fullRequest.copy_id,
                    pickupDateFormatted
                );
            } catch (notifError) {
                console.error('Failed to notify librarians:', notifError);
                // Không throw error để không block create process
            }
            
            return newRequest;
        } catch (error) {
            // Handle specific database errors
            if (error.code === '23503') { // Foreign key violation
                throw new Error('Invalid reader_id or copy_id');
            }
            throw error;
        }
    }

    static async findById(request_id) {
        if (!request_id) {
            throw new Error('request_id is required');
        }

        const query = `
            SELECT 
                br.request_id,
                br.reader_id,
                br.copy_id,
                br.pickup_date,
                br.request_date,
                br.status,
                bc.book_id,
                bc.condition,
                bc.availability,
                bc.copy_price,
                bt.title,
                bt.author,
                bt.publisher,
                bt.publish_year,
                bt.cover,
                bt.isbn,
                u.user_id,
                u.name as reader_name,
                u.email as reader_email
            FROM borrow_requests br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            JOIN book_titles bt ON bc.book_id = bt.book_id
            JOIN readers r ON br.reader_id = r.reader_id
            JOIN users u ON r.user_id = u.user_id
            WHERE br.request_id = $1
        `;
        
        const result = await pool.query(query, [request_id]);
        return result.rows[0] || null;
    }

    static async findByReaderId(reader_id) {
        if (!reader_id) {
            throw new Error('reader_id is required');
        }

        const query = `
            SELECT 
                br.request_id,
                br.reader_id,
                br.copy_id,
                br.pickup_date,
                br.request_date,
                br.status,
                bc.book_id,
                bc.condition,
                bc.availability,
                bt.title,
                bt.author,
                bt.publisher,
                bt.publish_year,
                bt.cover,
                bt.isbn
            FROM borrow_requests br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            JOIN book_titles bt ON bc.book_id = bt.book_id
            WHERE br.reader_id = $1
            ORDER BY br.request_date DESC
        `;
        
        const result = await pool.query(query, [reader_id]);
        
        // Transform the flat data into the nested structure expected by the frontend
        const transformedRequests = result.rows.map(row => ({
            request_id: row.request_id,
            reader_id: row.reader_id,
            copy_id: row.copy_id,
            pickup_date: row.pickup_date,
            request_date: row.request_date,
            status: row.status,
            condition: row.condition,
            availability: row.availability,
            book: {
                id: row.book_id,
                title: row.title,
                author: row.author,
                publisher: row.publisher,
                publication_year: row.publish_year,
                cover_image_url: row.cover, // Match frontend expectation
                isbn: row.isbn
            }
        }));

        return transformedRequests;
    }

    static async findAllPending() {
        const query = `
            SELECT 
                br.request_id,
                br.reader_id,
                br.copy_id,
                br.pickup_date,
                br.request_date,
                br.status,
                bc.book_id,
                bc.condition,
                bc.availability,
                bc.copy_price,
                bt.title,
                bt.author,
                bt.publisher,
                bt.publish_year,
                bt.cover,
                bt.isbn,
                u.user_id,
                u.username,
                u.name as reader_name,
                u.email as reader_email,
                u.status as reader_status
            FROM borrow_requests br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            JOIN book_titles bt ON bc.book_id = bt.book_id
            JOIN readers r ON br.reader_id = r.reader_id
            JOIN users u ON r.user_id = u.user_id
            WHERE br.status = 'pending'
            ORDER BY br.request_date ASC
        `;
        
        const result = await pool.query(query);
        
        const transformedRequests = result.rows.map(row => ({
            request_id: row.request_id,
            reader_id: row.reader_id,
            copy_id: row.copy_id,
            pickup_date: row.pickup_date,
            request_date: row.request_date,
            status: row.status,
            copy: {
                condition: row.condition,
                availability: row.availability,
                copy_price: row.copy_price
            },
            book: {
                id: row.book_id,
                title: row.title,
                author: row.author,
                publisher: row.publisher,
                publication_year: row.publish_year,
                cover_image_url: row.cover,
                isbn: row.isbn
            },
            user: {
                id: row.user_id,
                username: row.username,
                full_name: row.reader_name,
                email: row.reader_email,
                status: row.reader_status
            }
        }));

        return transformedRequests;
    }

    static async findAllApproved() {
        const query = `
            SELECT 
                br.request_id,
                br.reader_id,
                br.copy_id,
                br.pickup_date,
                br.request_date,
                br.status,
                bc.book_id,
                bc.condition,
                bc.availability,
                bc.copy_price,
                bt.title,
                bt.author,
                bt.publisher,
                bt.publish_year,
                bt.cover,
                bt.isbn,
                u.user_id,
                u.username,
                u.name as reader_name,
                u.email as reader_email,
                u.status as reader_status
            FROM borrow_requests br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            JOIN book_titles bt ON bc.book_id = bt.book_id
            JOIN readers r ON br.reader_id = r.reader_id
            JOIN users u ON r.user_id = u.user_id
            WHERE br.status = 'approved'
            ORDER BY br.pickup_date ASC
        `;
        
        const result = await pool.query(query);
        
        const transformedRequests = result.rows.map(row => ({
            request_id: row.request_id,
            reader_id: row.reader_id,
            copy_id: row.copy_id,
            pickup_date: row.pickup_date,
            request_date: row.request_date,
            status: row.status,
            copy: {
                condition: row.condition,
                availability: row.availability,
                copy_price: row.copy_price
            },
            book: {
                id: row.book_id,
                title: row.title,
                author: row.author,
                publisher: row.publisher,
                publication_year: row.publish_year,
                cover_image_url: row.cover,
                isbn: row.isbn
            },
            user: {
                id: row.user_id,
                username: row.username,
                full_name: row.reader_name,
                email: row.reader_email,
                status: row.reader_status
            }
        }));

        return transformedRequests;
    }

    static async approve(request_id) {
        if (!request_id) {
            throw new Error('request_id is required');
        }

        const existing = await this.findById(request_id);
        if (!existing) {
            throw new Error('Request not found');
        }

        if (existing.status !== 'pending') {
            throw new Error(`Cannot approve request with status: ${existing.status}`);
        }

        if (!existing.availability) {
            throw new Error('Copy is no longer available');
        }

        const query = `
            UPDATE borrow_requests
            SET status = 'approved'
            WHERE request_id = $1 AND status = 'pending'
            RETURNING 
                request_id,
                reader_id,
                copy_id,
                pickup_date,
                request_date,
                status
        `;
        
        const result = await pool.query(query, [request_id]);

        try {
            const pickupDateFormatted = new Date(existing.pickup_date)
                .toLocaleDateString('en-GB')
                .replace(/\//g, '-');
            
            await Notification.createRequestApproved(
                existing.user_id,
                request_id,
                existing.title,
                existing.copy_id,
                pickupDateFormatted
            );
        } catch (notifError) {
            console.error('Failed to create approval notification:', notifError);
        }
        
        if (result.rows.length === 0) {
            throw new Error('Failed to approve request - may have been modified');
        }

        return result.rows[0];
    }

    static async reject(request_id, rejection_reason = null) {
        if (!request_id) {
            throw new Error('request_id is required');
        }

        if (!rejection_reason || rejection_reason.trim() === '') {
            throw new Error('rejection_reason is required');
        }

        const existing = await this.findById(request_id);
        if (!existing) {
            throw new Error('Request not found');
        }

        if (existing.status !== 'pending') {
            throw new Error(`Cannot reject request with status: ${existing.status}`);
        }

        const query = `
            DELETE FROM borrow_requests
            WHERE request_id = $1 AND status = 'pending'
            RETURNING 
                request_id,
                reader_id,
                copy_id,
                pickup_date,
                request_date,
                status
        `;
        
        const result = await pool.query(query, [request_id]);
        
        if (result.rows.length === 0) {
            throw new Error('Failed to reject request - may have been modified');
        }
        
        try {
            await Notification.createRequestRejected(
                existing.user_id,
                request_id,
                existing.title,
                existing.copy_id,
                rejection_reason
            );
        } catch (notifError) {
            console.error('Failed to create rejection notification:', notifError);
        }
        
        return result.rows[0];
    }
    
    static async hasPendingRequestForBook(reader_id, book_id) {
        if (!reader_id || !book_id) {
            throw new Error('reader_id and book_id are required');
        }

        const query = `
            SELECT COUNT(*) as count
            FROM borrow_requests br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            WHERE br.reader_id = $1 
              AND bc.book_id = $2
              AND br.status = 'pending'
        `;
        
        const result = await pool.query(query, [reader_id, book_id]);
        return parseInt(result.rows[0].count) > 0;
    }

    static async hasApprovedRequestForBook(reader_id, book_id) {
        if (!reader_id || !book_id) {
            throw new Error('reader_id and book_id are required');
        }

        const query = `
            SELECT COUNT(*) as count
            FROM borrow_requests br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            WHERE br.reader_id = $1 
              AND bc.book_id = $2
              AND br.status = 'approved'
        `;
        
        const result = await pool.query(query, [reader_id, book_id]);
        return parseInt(result.rows[0].count) > 0;
    }

    /**
     * Đếm tổng số pending/approved requests + active borrowings của reader
     * Business rule: Tổng không được vượt quá 5
     * @param {number} reader_id - ID của reader
     * @returns {number} Tổng số requests + borrowings
     */
    static async countTotalActiveRequestsAndBorrowings(reader_id) {
        if (!reader_id) {
            throw new Error('reader_id is required');
        }

        const query = `
            SELECT 
                (
                    -- Pending + Approved requests (chưa pickup)
                    SELECT COUNT(*) 
                    FROM borrow_requests 
                    WHERE reader_id = $1 
                      AND status IN ('pending', 'approved')
                ) + (
                    -- Active borrowings (đã pickup, chưa trả)
                    SELECT COUNT(*) 
                    FROM borrowing_records 
                    WHERE reader_id = $1 
                      AND status = 'approved'
                ) as total_count
        `;
        
        const result = await pool.query(query, [reader_id]);
        return parseInt(result.rows[0].total_count);
    }

    static async isCurrentlyBorrowingTitle(reader_id, book_id) {
        if (!reader_id || !book_id) {
            throw new Error('reader_id and book_id are required');
        }

        const query = `
            SELECT COUNT(*) as count
            FROM borrowing_records br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            WHERE br.reader_id = $1 
              AND bc.book_id = $2
              AND br.status = 'approved'
        `;
        
        const result = await pool.query(query, [reader_id, book_id]);
        return parseInt(result.rows[0].count) > 0;
    }

    static async cancel(request_id, reader_id) {
        if (!request_id || !reader_id) {
            throw new Error('request_id and reader_id are required');
        }

        const existing = await this.findById(request_id);
        if (!existing) {
            throw new Error('Request not found');
        }

        if (existing.reader_id !== reader_id) {
            throw new Error('Unauthorized - request does not belong to this reader');
        }

        if (existing.status !== 'pending') {
            throw new Error(`Cannot cancel request with status: ${existing.status}`);
        }

        const query = `
            DELETE FROM borrow_requests
            WHERE request_id = $1 AND reader_id = $2 AND status = 'pending'
            RETURNING 
                request_id,
                reader_id,
                copy_id,
                pickup_date,
                request_date,
                status
        `;
        
        const result = await pool.query(query, [request_id, reader_id]);
        
        if (result.rows.length === 0) {
            throw new Error('Failed to cancel request - may have been modified');
        }

        return result.rows[0];
    }
}

module.exports = BorrowRequest;
