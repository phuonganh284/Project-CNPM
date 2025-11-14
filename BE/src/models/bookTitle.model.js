const { pool } = require('../config/database');

class BookTitle {
    static async updateAvailableStock(bookId, client = pool) {
        if (!bookId) {
          throw new Error('bookId is required to update available stock.');
        }
    
        const stockQuery = `
          WITH stock AS (
            SELECT
              COUNT(*) AS available_count
            FROM book_copies
            WHERE
              book_id = $1
              AND borrowed = FALSE
              AND availability = TRUE
              AND condition >= 50
          )
          UPDATE book_titles
          SET
            available_stock = stock.available_count
          FROM stock
          WHERE book_id = $1
          RETURNING available_stock;
        `;
    
        await client.query(stockQuery, [bookId]);
      }
}

module.exports = BookTitle;
