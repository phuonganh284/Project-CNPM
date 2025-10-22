// src/data/mockBorrows.js

export const mockBorrows = [
    {
        id: 1,
        title: "Don't Make Me Think",
        author: "Steve Krug, 2000",
        cover: "https://m.media-amazon.com/images/I/51pnouuPO5L._SY466_.jpg",
        borrowedOn: "11 Mar 2023 09:00 AM",
        returnDue: "2025-10-1",
        isOverdue: true, 
        renewed: false,
        isPendingReturn: false 
    },
    {
        id: 2,
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki, 1997",
        cover: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SY466_.jpg",
        borrowedOn: "09 Mar 2023 08:00 AM",
        returnDue: "2025-10-25",
        isOverdue: false,
        renewed: true,
        isPendingReturn: false 
    },
    {
        id: 3,
        title: "The Design of Everyday Things",
        author: "Don Norman, 1988",
        cover: "https://m.media-amazon.com/images/I/416Hql52NCL._SY466_.jpg",
        borrowedOn: "09 Mar 2023 09:00 AM",
        returnDue: "2025-10-25",
        isOverdue: false,
        renewed: false,
        isPendingReturn: false 
    },
    {
        id: 4,
        title: "Sprint",
        author: "Jake Knapp, 2016",
        cover: "https://m.media-amazon.com/images/I/71y2wZgkJ6L._SL1500_.jpg",
        borrowedOn: "11 Mar 2023 08:00 AM",
        returnDue: "14 Mar 2023",
        isOverdue: false,
        renewed: false,
        isPendingReturn: false 
    },
];