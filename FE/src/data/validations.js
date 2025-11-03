import { z } from "zod"

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

// Register schema
export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["reader", "admin"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Book borrowing schema
export const borrowBookSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  userId: z.string().min(1, "User ID is required"),
  borrowDate: z.date().optional(),
  returnDate: z.date().optional(),
})

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  category: z.string().optional(),
  sortBy: z.enum(["title", "author", "date", "popularity"]).optional(),
})
