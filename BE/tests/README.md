# Backend Testing Guide

This document provides an overview of the testing setup for the backend of the Library Management System. It explains how to run tests and how the tests are structured.

## 1. Testing Frameworks

- **[Jest](https://jestjs.io/):** The primary testing framework for running tests, making assertions, and mocking.
- **[Supertest](https://github.com/visionmedia/supertest):** Used for integration tests to make HTTP requests to the Express application endpoints.

## 2. How to Run Tests

All commands should be run from the `BE/` directory.

### Run All Tests

To run the entire test suite (both unit and integration tests):

```bash
npm test
```

### Run a Specific Test File

To run a single test file, which is useful during development:

```bash
npm test -- <path_to_test_file>
```

**Example:**

```bash
npm test -- tests/authentication.integration.test.js
```

### Run in Watch Mode

To have Jest automatically re-run tests whenever a file is changed:

```bash
npm run test:watch
```

## 3. Test Structure

The tests are organized into two main types: **Unit Tests** and **Integration Tests**.

### Unit Tests

- **Purpose:** To test a single, isolated piece of code (a "unit"), typically a single method within a model. These tests do not connect to a real database; they "mock" the database to ensure the test is fast and only checks the business logic of the function itself.
- **Location:** These files are typically named after the module they test (e.g., `*.model.test.js`).

**Files:**

-   `borrowing.model.test.js`:
    -   Tests the business logic for the `Borrowing` model.
    -   **Covers:** The `renew()` method, ensuring it correctly adds 14 days, prevents renewing more than once, and blocks renewing overdue books.

-   `borrowRequest.model.test.js`:
    -   Tests the business logic for the `BorrowRequest` model.
    -   **Covers:** The `hasPendingRequestForBook()` method (checking for duplicate requests) and `countTotalActiveRequestsAndBorrowings()` (checking borrow limits).

### Integration Tests

- **Purpose:** To test a complete feature flow from the perspective of a user making an API call. These tests check how different parts of the system (controllers, models, middleware) "integrate" and work together. They interact with a real test database.
- **Location:** These files are typically named after the feature or API resource they test (e.g., `*.integration.test.js`).

**Files:**

-   `authentication.integration.test.js`:
    -   Tests the critical user authentication flow.
    -   **Covers:** Successful user registration, preventing registration with a duplicate email, successful login, and failed login with a wrong password.

-   `borrowRequest.integration.test.js`:
    -   Tests the API flow for creating and managing borrow requests.
    -   **Covers:** Successful creation of a borrow request, successful approval by a librarian, and preventing a reader from approving a request (authorization test).

## 4. Writing New Tests

- **Convention:** All test files must end with the `.test.js` suffix.
- **Unit Tests:** When testing a specific function's logic, create or add to the corresponding unit test file and be sure to mock all external dependencies (like the database).
- **Integration Tests:** When testing a new API endpoint or feature flow, create a new `*.integration.test.js` file. These tests should clean up after themselves by deleting any data they create in the database (see `authentication.integration.test.js` for an example using `beforeAll` and `afterAll`).
