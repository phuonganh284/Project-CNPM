// Mock data cho notifications - XÓA FILE NÀY KHI TÍCH HỢP BE
// Sau này chỉ cần gọi API thay vì import file này

export const getNotificationsByRole = (userRole) => {
    const notifications = {
        reader: [
            {
                id: 1,
                type: 'CHARGE_ISSUED',
                title: 'Payment required for "Rich Dad Poor Dad"',
                description: 'Total charge: 400,000 đ (late fee + damage)',
                time: '5m',
                isRead: false,
                payload: {
                    chargeId: 'CH001',
                    loanId: 'L123',
                    bookTitle: 'Rich Dad Poor Dad',
                    amount_total: 400000,
                    lines: [
                        { type: 'OVERDUE', qty: 3, price: 50000, subtotal: 150000, label: 'Late fee (3 days × 50,000đ/day)' },
                        { type: 'DAMAGE', qty: 1, price: 250000, subtotal: 250000, label: 'Minor damage fee' }
                    ],
                    issued_at: '2025-10-20T10:30:00Z',
                },
            },
            {
                id: 2,
                type: 'REQUEST_APPROVED',
                title: 'Your borrow request has been approved!',
                description: 'You can pick up "Clean Code" at the library.',
                time: '1h',
                isRead: false,
                payload: {
                    requestId: 'REQ456',
                    bookTitle: 'Clean Code',
                    bookAuthor: 'Robert C. Martin',
                    pickup_date: '2025-10-22',
                    pickup_location: 'Main Library, Floor 2, Counter A',
                    expires_at: '2025-10-22T20:00:00Z',
                },
            },
            {
                id: 3,
                type: 'REQUEST_REJECTED',
                title: 'Your borrow request was rejected',
                description: 'Request for "Introduction to Algorithms" was rejected.',
                time: '2d',
                isRead: true,
                payload: {
                    requestId: 'REQ789',
                    bookTitle: 'Introduction to Algorithms',
                    reject_reason: 'All copies are currently reserved or under repair. Please try again next week.',
                    rejected_at: '2025-10-18T14:00:00Z',
                },
            },
            {
                id: 4,
                type: 'DUE_SOON',
                title: 'Book due in 3 days: "The Pragmatic Programmer"',
                description: 'Please return or renew before Oct 23, 2025.',
                time: '1d',
                isRead: true,
                payload: {
                    loanId: 'L456',
                    bookTitle: 'The Pragmatic Programmer',
                    due_date: '2025-10-23',
                    canRenew: true,
                    renew_count: 0,
                    max_renews: 2,
                },
            },
            {
                id: 5,
                type: 'OVERDUE',
                title: 'Overdue: "Design Patterns"',
                description: 'This book is 5 days overdue. Late fees apply.',
                time: '2d',
                isRead: true,
                payload: {
                    loanId: 'L789',
                    bookTitle: 'Design Patterns',
                    due_date: '2025-10-15',
                    days_overdue: 5,
                    late_fee_per_day: 50000,
                    total_late_fee: 250000,
                },
            },
        ],
        librarian: [
            {
                id: 1,
                type: 'NEW_BORROW_REQUEST',
                title: 'New borrow request for "Clean Code"',
                description: 'User John Doe requested to borrow.',
                time: '2m',
                isRead: false,
                payload: {
                    requestId: 'REQ456',
                    userId: 'R12345',
                    userName: 'John Doe',
                    userEmail: 'john.doe@example.com',
                    bookId: 'B001',
                    bookTitle: 'Clean Code',
                    bookAuthor: 'Robert C. Martin',
                    pickup_date: '2025-10-22',
                    requested_at: '2025-10-20T14:25:00Z',
                },
                actionsAllowed: {
                    canApprove: true,
                    canReject: true,
                },
            },
            {
                id: 2,
                type: 'NEW_RETURN_REQUEST',
                title: 'Return request for "Rich Dad Poor Dad"',
                description: 'User Jack97 wants to return the book.',
                time: '18m',
                isRead: false,
                payload: {
                    returnRequestId: 'RET001',
                    loanId: 'L123',
                    userId: 'R98765',
                    userName: 'Jack97',
                    bookTitle: 'Rich Dad Poor Dad',
                    borrowed_at: '2025-09-20',
                    due_date: '2025-10-17',
                    days_overdue: 3,
                    requested_at: '2025-10-20T13:45:00Z',
                },
                actionsAllowed: {
                    canAssess: true,
                },
            },
            {
                id: 3,
                type: 'SYSTEM_ALERT',
                title: 'Low inventory for "Introduction to Algorithms"',
                description: 'Only 2 copies available, 5 users in queue.',
                time: '2d',
                isRead: true,
                payload: {
                    bookId: 'B999',
                    bookTitle: 'Introduction to Algorithms',
                    available_count: 2,
                    borrowed_count: 8,
                    pending_requests: 5,
                    recommendation: 'Consider purchasing more copies to meet demand.',
                },
            },
        ],
    };

    return notifications[userRole] || [];
};
