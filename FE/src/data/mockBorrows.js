// src/data/mockBorrows.js

// TODO: KHI CÓ BE - Fetch từ API /api/loans/my-borrows
export const mockBorrows = [
    {
        id: 1,
        loanId: "L001",
        copyId: "C003",
        title: "Don't Make Me Think",
        author: "Steve Krug, 2000",
        cover: "https://m.media-amazon.com/images/I/51pnouuPO5L._SY466_.jpg",
        borrowedOn: "11 Mar 2023 09:00 AM",
        returnDue: "2025-10-1",
        borrowedCondition: 85, // Condition lúc mượn
        isOverdue: true, 
        renewed: false,
        isPendingReturn: false 
    },
    {
        id: 2,
        loanId: "L002",
        copyId: "C007",
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki, 1997",
        cover: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SY466_.jpg",
        borrowedOn: "09 Mar 2023 08:00 AM",
        returnDue: "2025-10-25",
        borrowedCondition: 70,
        isOverdue: false,
        renewed: true,
        isPendingReturn: false 
    },
    {
        id: 3,
        loanId: "L003",
        copyId: "C012",
        title: "The Design of Everyday Things",
        author: "Don Norman, 1988",
        cover: "https://m.media-amazon.com/images/I/416Hql52NCL._SY466_.jpg",
        borrowedOn: "09 Mar 2023 09:00 AM",
        returnDue: "2025-10-25",
        borrowedCondition: 100,
        isOverdue: false,
        renewed: false,
        isPendingReturn: false 
    },
    {
        id: 4,
        loanId: "L004",
        copyId: "C019",
        title: "Sprint",
        author: "Jake Knapp, 2016",
        cover: "https://m.media-amazon.com/images/I/71y2wZgkJ6L._SL1500_.jpg",
        borrowedOn: "09 Mar 2023 09:00 AM",
        returnDue: "2025-10-25",
        borrowedCondition: 55,
        isOverdue: false,
        renewed: false,
        isPendingReturn: false 
    },
    {
        id: 5,
        loanId: "L005",
        copyId: "C021",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, 2019",
        cover: "https://m.media-amazon.com/images/I/71f1jieYHNL._SY466_.jpg",
        borrowedOn: "11 Mar 2023 09:00 AM",
        returnDue: "2025-10-1",
        borrowedCondition: 90,
        isOverdue: true,
        renewed: false,
        isPendingReturn: false 
    },
];