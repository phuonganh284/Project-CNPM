// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Welcome from "./pages/public/Welcome";
import SelectRole from "./pages/public/SelectRole";
import HomePage from "./pages/public/HomePage";
import BrowsePage from "./pages/public/BrowsePage";
import BookDetailPage from "./pages/public/BookDetailPage";
import About from "./pages/public/About";
import RulesPage from "./pages/public/RulesPage";
import SupportPage from "./pages/public/SupportPage";
import TermsPage from "./pages/public/TermsPage";

// Librarian pages
import DashboardPage from "./pages/librarian/DashboardPage";
import BooksPage from "./pages/librarian/BooksPage";
import UsersPage from "./pages/librarian/UsersPage";
import BorrowRequestsPage from "./pages/librarian/BorrowRequestsPage";
import ApprovedRequestPage from "./pages/librarian/ApprovedRequestPage";
import ReturnRequestPage from "./pages/librarian/ReturnRequestPage";
import BorrowingPage from "./pages/librarian/BorrowingPage";
import ReaderDetailsPage from "./pages/librarian/ReaderDetailsPage";
import BookCopiesPage from "./pages/librarian/BookCopiesPage";

// Reader pages
import MyBorrowsPage from "./pages/reader/MyBorrowsPage";
import MyRequestsPage from "./pages/reader/MyRequestsPage";
import ProfilePage from "./pages/reader/ProfilePage";
import BorrowingHistoryPage from "./pages/reader/BorrowingHistoryPage";

// Librarian Profile page
import LibrarianProfilePage from "./pages/librarian/ProfilePage";

// Public pages (Login/Register)
import LoginReader from "./pages/public/LoginReader";
import Register from "./pages/public/Register";
import LoginLibrarian from "./pages/public/LoginLibrarian";

// Reset Password pages
import SendMailToResetPass from "./pages/public/SendMailToResetPass";
import OpenMailToResetPass from "./pages/public/OpenMailToResetPass";
import ResetPass from "./pages/public/ResetPass";
import ResetSuccess from "./pages/public/ResetSuccess";

const App = () => {
  return (
    <Router>
      <Routes>
        {/*Routes------------------------------------*/}
        {/* Welcome page - không có Layout */}
        <Route path="/" element={<Welcome />} />

        {/* Select Role page - không có Layout */}
        <Route path="/select-role" element={<SelectRole />} />

        {/* Login pages - không có Layout */}
        <Route path="/login-reader" element={<LoginReader />} />
        <Route path="/login-librarian" element={<LoginLibrarian />} />

        {/* Register page - không có Layout */}
        <Route path="/register" element={<Register />} />

        {/* Reset Password pages - không có Layout */}
        <Route path="/send-mail-to-reset-pass" element={<SendMailToResetPass />} />
        <Route path="/open-mail-to-reset-pass" element={<OpenMailToResetPass />} />
        <Route path="/reset-pass" element={<ResetPass />} />
        <Route path="/reset-success" element={<ResetSuccess />} />

        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Librarian routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:bookId/copies" element={<BookCopiesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:userId" element={<ReaderDetailsPage />} />
          <Route path="/borrow-requests" element={<BorrowRequestsPage />} />
          <Route path="/approved-requests" element={<ApprovedRequestPage />} />
          <Route path="/return-requests" element={<ReturnRequestPage />} />
          <Route path="/borrowing" element={<BorrowingPage />} />
          <Route path="/librarian-profile" element={<LibrarianProfilePage />} />

          {/* Reader routes */}
          <Route path="/my-borrows" element={<MyBorrowsPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/borrowing-history" element={<BorrowingHistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;