// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/public/HomePage";
import BrowsePage from "./pages/public/BrowsePage";
import About from "./components/About";

// Librarian pages
import BooksPage from "./pages/librarian/BooksPage";
import UsersPage from "./pages/librarian/UsersPage";
import BorrowRequestsPage from "./pages/librarian/BorrowRequestsPage";
import ApprovedRequestPage from "./pages/librarian/ApprovedRequestPage";
import ReturnRequestPage from "./pages/librarian/ReturnRequestPage";
import BorrowingPage from "./pages/librarian/BorrowingPage";

// Reader pages
import MyBorrowsPage from "./pages/reader/MyBorrowsPage";
import MyRequestsPage from "./pages/reader/MyRequestsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/*Routes------------------------------------*/}
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/about" element={<About />} />

          {/* Librarian routes */}
          <Route path="/books" element={<BooksPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/borrow-requests" element={<BorrowRequestsPage />} />
          <Route path="/approved-requests" element={<ApprovedRequestPage />} />
          <Route path="/return-requests" element={<ReturnRequestPage />} />
          <Route path="/borrowing" element={<BorrowingPage />} />

          {/* Reader routes */}
          <Route path="/my-borrows" element={<MyBorrowsPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
