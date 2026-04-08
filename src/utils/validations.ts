import { z } from 'zod';

// Base schema without password (for editing)
export const profileSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  permanentAddress: z.string().min(5, 'Address is required'),
  residentialAddress: z.string().min(5, 'Address is required'),
  graduationYear: z.string().min(4, 'Graduation year is required'),
  courseOfStudy: z.string().min(2, 'Course of study is required'),
  unit: z.string().min(1, 'Please select a unit'),
});

// Full schema with password (for registration)
export const registrationSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  permanentAddress: z.string().min(5, 'Address is required'),
  residentialAddress: z.string().min(5, 'Address is required'),
  graduationYear: z.string().min(4, 'Graduation year is required'),
  courseOfStudy: z.string().min(2, 'Course of study is required'),
  unit: z.string().min(1, 'Please select a unit'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  purpose: z.string().min(1, 'Please select a purpose'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(3, 'Venue is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const communicationSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  recipients: z.array(z.string()).min(1, 'Select at least one recipient'),
});