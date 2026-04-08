export interface User {
  id: string;
  _id?: string; // MongoDB uses _id
  email: string;
  fullName: string;
  role: 'admin' | 'member';
  dateOfBirth: string;
  phoneNumber: string;
  permanentAddress: string;
  residentialAddress: string;
  graduationYear: string;
  courseOfStudy: string;
  unit: string;
  password: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  paymentMethod: string;
  transactionId: string;
}

export interface Event {
  id: string;
  _id?: string; // MongoDB uses _id
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  createdBy: string;
}
export interface Communication {
  id: string;
  type: 'email' | 'sms';
  subject: string;
  message: string;
  recipients: string[];
  sentAt: string;
  status: 'sent' | 'draft' | 'failed';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DonationFormData {
  amount: number;
  purpose: string;
  paymentMethod: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  permanentAddress: string;
  residentialAddress: string;
  graduationYear: string;
  courseOfStudy: string;
  unit: string;
  password: string;
  confirmPassword: string;
}