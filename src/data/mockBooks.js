// Mock data for Books
export const mockBooks = [
    {
        id: 1,
        title: "Don't Make Me Think",
        author: "Steve Krug",
        publisher: "New Riders",
        publish_year: 2000,
        isbn: "978-0321965516",
        page_count: 216,
        category: "Computer Science",
        language: "English",
        description: "A common sense approach to web usability. Since it was first published in 2000, hundreds of thousands of Web designers and developers have relied on usability guru Steve Krug's guide to help them understand the principles of intuitive navigation and information design. Witty, commonsensical, and eminently practical, it's one of the best-loved and most recommended books on the subject.",
        cover_url: "https://m.media-amazon.com/images/I/51pnouuPO5L._SY466_.jpg",
        price: 45.00,
        total_copies: 5,
        available_copies: 2,
        status: "available",
        created_at: "2025-11-07T10:30:00Z"
    },
    {
        id: 2,
        title: "The Design of Everyday Things",
        author: "Don Norman",
        publisher: "Basic Books",
        publish_year: 1988,
        isbn: "978-0465050659",
        page_count: 368,
        category: "Computer Science",
        language: "English",
        description: "Even the smartest among us can feel inept as we fail to figure out which light switch or oven burner to turn on, or whether to push, pull, or slide a door. The fault, argues this ingenious—even liberating—book, lies not in ourselves, but in product design that ignores the needs of users and the principles of cognitive psychology.",
        cover_url: "https://m.media-amazon.com/images/I/416Hql52NCL._SY466_.jpg",
        price: 38.00,
        total_copies: 10,
        available_copies: 0,
        status: "borrowed",
        created_at: "2025-11-07T10:35:00Z"
    },
    {
        id: 3,
        title: "Sprint",
        author: "Jake Knapp",
        publisher: "Simon & Schuster",
        publish_year: 2016,
        isbn: "978-1501121746",
        page_count: 288,
        category: "Business",
        language: "English",
        description: "From three design partners at Google Ventures, a unique five-day process for solving tough problems using design, prototyping, and testing ideas with customers. Sprint offers a transformative formula for testing ideas that works whether you're at a startup or a large organization.",
        cover_url: "https://m.media-amazon.com/images/I/71y2wZgkJ6L._SL1500_.jpg",
        price: 42.00,
        total_copies: 8,
        available_copies: 6,
        status: "available",
        created_at: "2025-10-15T14:20:00Z"
    },
    {
        id: 4,
        title: "Lean UX",
        author: "Jeff Gothelf",
        publisher: "O'Reilly Media",
        publish_year: 2016,
        isbn: "978-1491953600",
        page_count: 304,
        category: "Computer Science",
        language: "English",
        description: "The Lean UX approach to interaction design is tailor-made for today's web-driven reality. In this insightful book, leading advocate Jeff Gothelf teaches you valuable Lean UX principles, tactics, and techniques from the ground up—how to rapidly experiment with design ideas, validate them with real users, and continually adjust your design based on what you learn.",
        cover_url: "https://m.media-amazon.com/images/I/81qJb1LmkBL._SL1500_.jpg",
        price: 48.00,
        total_copies: 7,
        available_copies: 0,
        status: "out-of-stock",
        created_at: "2025-10-20T09:15:00Z"
    },
    {
        id: 5,
        title: "The Road to React",
        author: "Robin Wieruch",
        publisher: "Leanpub",
        publish_year: 2020,
        isbn: "978-1720043997",
        page_count: 412,
        category: "Computer Science",
        language: "English",
        description: "The Road to React teaches you the fundamentals of React. You will build a real-world application along the way in plain React without complicated tooling. Everything from project setup to deployment on a server will be explained. The book comes with additional referenced reading material and exercises with each chapter.",
        cover_url: "https://m.media-amazon.com/images/I/613i1dMgs1L._SL1500_.jpg",
        price: 39.00,
        total_copies: 12,
        available_copies: 8,
        status: "available",
        created_at: "2025-11-05T16:45:00Z"
    },
    {
        id: 6,
        title: "Rich Dad Poor Dad",
        author: "Robert T Kiyosaki",
        publisher: "Plata Publishing",
        publish_year: 1997,
        isbn: "978-1612680194",
        page_count: 336,
        category: "Financial MGMT",
        language: "English",
        description: "Rich Dad Poor Dad is Robert's story of growing up with two dads — his real father and the father of his best friend, his rich dad — and the ways in which both men shaped his thoughts about money and investing. The book explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.",
        cover_url: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SY466_.jpg",
        price: 35.00,
        total_copies: 15,
        available_copies: 10,
        status: "available",
        created_at: "2025-11-07T11:00:00Z"
    },
    {
        id: 7,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        publisher: "Bloomsbury",
        publish_year: 1997,
        isbn: "978-0439708180",
        page_count: 309,
        category: "Fiction",
        language: "English",
        description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard.",
        cover_url: "https://m.media-amazon.com/images/I/81iqZ2HHD-L._SY466_.jpg",
        price: 28.00,
        total_copies: 20,
        available_copies: 12,
        status: "available",
        created_at: "2025-10-28T08:30:00Z"
    },
    {
        id: 8,
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        publisher: "O'Reilly Media",
        publish_year: 2014,
        isbn: "978-1491904244",
        page_count: 278,
        category: "Computer Science",
        language: "English",
        description: "No matter how much experience you have with JavaScript, odds are you don't fully understand the language. This concise yet in-depth guide takes you inside scope and closures, two core concepts you need to know to become a more efficient and effective JavaScript programmer.",
        cover_url: "https://m.media-amazon.com/images/I/91-PASfiUVL._SL1500_.jpg",
        price: 32.00,
        total_copies: 9,
        available_copies: 7,
        status: "available",
        created_at: "2025-11-01T13:20:00Z"
    },
    {
        id: 9,
        title: "Clean Code",
        author: "Robert C. Martin",
        publisher: "Prentice Hall",
        publish_year: 2008,
        isbn: "978-0132350884",
        page_count: 464,
        category: "Computer Science",
        language: "English",
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way. Clean Code is divided into three parts.",
        cover_url: "https://m.media-amazon.com/images/I/71T7aD3EOTL._SY466_.jpg",
        price: 52.00,
        total_copies: 8,
        available_copies: 5,
        status: "available",
        created_at: "2025-10-25T10:00:00Z"
    },
    {
        id: 10,
        title: "Atomic Habits",
        author: "James Clear",
        publisher: "Avery",
        publish_year: 2018,
        isbn: "978-0735211292",
        page_count: 320,
        category: "Self-Help",
        language: "English",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
        cover_url: "https://m.media-amazon.com/images/I/81YkqyaFVEL._SY466_.jpg",
        price: 27.00,
        total_copies: 15,
        available_copies: 9,
        status: "available",
        created_at: "2025-11-03T15:10:00Z"
    },
    {
        id: 11,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        publisher: "Addison-Wesley",
        publish_year: 2019,
        isbn: "978-0135957059",
        page_count: 352,
        category: "Computer Science",
        language: "English",
        description: "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years. Whether you're new to the field or an experienced practitioner, you'll come away with fresh insights each and every time. Dave Thomas and Andy Hunt wrote the first edition of this influential book in 1999 to help their clients create better software.",
        cover_url: "https://m.media-amazon.com/images/I/71f1jieYHNL._SY466_.jpg",
        price: 49.00,
        total_copies: 6,
        available_copies: 0,
        status: "borrowed",
        created_at: "2025-10-18T09:00:00Z"
    },
    {
        id: 12,
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        publisher: "No Starch Press",
        publish_year: 2018,
        isbn: "978-1593279509",
        page_count: 472,
        category: "Computer Science",
        language: "English",
        description: "A modern introduction to programming with JavaScript. This much anticipated and thoroughly revised third edition of Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code. It has been updated to reflect the current state of Java­Script and web browsers.",
        cover_url: "https://m.media-amazon.com/images/I/91asIC1fRwL._SY466_.jpg",
        price: 38.00,
        total_copies: 10,
        available_copies: 6,
        status: "available",
        created_at: "2025-10-30T11:30:00Z"
    },
    {
        id: 13,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        publisher: "Farrar, Straus and Giroux",
        publish_year: 2011,
        isbn: "978-0374533557",
        page_count: 499,
        category: "Psychology",
        language: "English",
        description: "A groundbreaking tour of the mind and explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical. The impact of overconfidence on corporate strategies, the difficulties of predicting what will make us happy in the future, the profound effect of cognitive biases.",
        cover_url: "https://m.media-amazon.com/images/I/61fdrEuPJwL._SL1500_.jpg",
        price: 30.00,
        total_copies: 12,
        available_copies: 8,
        status: "available",
        created_at: "2025-11-02T14:00:00Z"
    },
    {
        id: 14,
        title: "The Lean Startup",
        author: "Eric Ries",
        publisher: "Crown Business",
        publish_year: 2011,
        isbn: "978-0307887894",
        page_count: 336,
        category: "Business",
        language: "English",
        description: "Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted around the world, changing the way companies are built and new products are launched. Eric Ries defines a startup as an organization dedicated to creating something new under conditions of extreme uncertainty.",
        cover_url: "https://m.media-amazon.com/images/I/81vvgZqCskL._SY466_.jpg",
        price: 26.00,
        total_copies: 14,
        available_copies: 11,
        status: "available",
        created_at: "2025-10-22T16:20:00Z"
    },
    {
        id: 15,
        title: "1984",
        author: "George Orwell",
        publisher: "Signet Classic",
        publish_year: 1949,
        isbn: "978-0451524935",
        page_count: 328,
        category: "Fiction",
        language: "English",
        description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. Written in 1948, 1984 was George Orwell's chilling prophecy about the future. And while 1984 has come and gone, his dystopian vision of a government that will do anything to control the narrative is timelier than ever.",
        cover_url: "https://m.media-amazon.com/images/I/71kxa1-0mfL._SY466_.jpg",
        price: 15.00,
        total_copies: 18,
        available_copies: 13,
        status: "available",
        created_at: "2025-10-12T08:00:00Z"
    }
];

// Helper functions
export const getAvailableBooks = () => {
    return mockBooks.filter(book => book.available_copies > 0);
};

export const getRecommendedBooks = () => {
    // Giả lập: lấy sách có available_copies > 0, sort theo popularity (random cho demo)
    return mockBooks
        .filter(book => book.available_copies > 0)
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
};

export const getBookById = (id) => {
    return mockBooks.find(book => book.id === id);
};

export const searchBooks = (query) => {
    const lowerQuery = query.toLowerCase();
    return mockBooks.filter(book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.category.toLowerCase().includes(lowerQuery)
    );
};

export const getBooksByCategory = (category) => {
    return mockBooks.filter(book => book.category === category);
};
