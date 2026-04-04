import { User, Donation, Event } from '../types';
import { generateId } from '../utils/helpers';

export const seedInitialData = () => {
  const users: User[] = [
    {
      id: '1',
      email: 'admin@cspapp.com',
      fullName: 'Pastor John Smith',
      role: 'admin',
      dateOfBirth: '1980-05-15',
      phoneNumber: '+2348012345678',
      permanentAddress: '123 Church Street, Lagos',
      residentialAddress: '123 Church Street, Lagos',
      graduationYear: '2005',
      courseOfStudy: 'Theology',
      unit: 'Pastoral',
      password: 'admin123',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'member1@example.com',
      fullName: 'Sarah Johnson',
      role: 'member',
      dateOfBirth: '1995-08-22',
      phoneNumber: '+2348023456789',
      permanentAddress: '45 Unity Road, Abuja',
      residentialAddress: '45 Unity Road, Abuja',
      graduationYear: '2018',
      courseOfStudy: 'Business Administration',
      unit: 'Choir',
      password: 'member123',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'member2@example.com',
      fullName: 'Michael Okafor',
      role: 'member',
      dateOfBirth: '1992-03-10',
      phoneNumber: '+2348034567890',
      permanentAddress: '78 Peace Avenue, Port Harcourt',
      residentialAddress: '78 Peace Avenue, Port Harcourt',
      graduationYear: '2016',
      courseOfStudy: 'Computer Science',
      unit: 'Media',
      password: 'member123',
      createdAt: new Date().toISOString(),
    },
  ];

  const donations: Donation[] = [
    {
      id: generateId(),
      userId: '2',
      amount: 50000,
      purpose: 'Tithe',
      status: 'completed',
      createdAt: new Date('2024-01-15').toISOString(),
      paymentMethod: 'card',
      transactionId: 'TXN001',
    },
    {
      id: generateId(),
      userId: '2',
      amount: 25000,
      purpose: 'Offering',
      status: 'completed',
      createdAt: new Date('2024-02-01').toISOString(),
      paymentMethod: 'card',
      transactionId: 'TXN002',
    },
    {
      id: generateId(),
      userId: '3',
      amount: 100000,
      purpose: 'Project',
      status: 'completed',
      createdAt: new Date('2024-01-20').toISOString(),
      paymentMethod: 'bank_transfer',
      transactionId: 'TXN003',
    },
  ];

  const events: Event[] = [
    {
      id: generateId(),
      title: 'Sunday Service',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '09:00 AM',
      venue: 'Main Sanctuary',
      description: 'Join us for a powerful worship experience and Word exposition.',
      createdAt: new Date().toISOString(),
      createdBy: '1',
    },
    {
      id: generateId(),
      title: 'Bible Study',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '05:00 PM',
      venue: 'Fellowship Hall',
      description: 'Weekly Bible study and prayer meeting.',
      createdAt: new Date().toISOString(),
      createdBy: '1',
    },
    {
      id: generateId(),
      title: 'Youth Conference',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM',
      venue: 'Conference Center',
      description: 'Annual youth gathering with special guests and activities.',
      createdAt: new Date().toISOString(),
      createdBy: '1',
    },
  ];

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('donations', JSON.stringify(donations));
  localStorage.setItem('events', JSON.stringify(events));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getDonations = (): Donation[] => {
  const donations = localStorage.getItem('donations');
  return donations ? JSON.parse(donations) : [];
};

export const getEvents = (): Event[] => {
  const events = localStorage.getItem('events');
  return events ? JSON.parse(events) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const saveDonations = (donations: Donation[]) => {
  localStorage.setItem('donations', JSON.stringify(donations));
};

export const saveEvents = (events: Event[]) => {
  localStorage.setItem('events', JSON.stringify(events));
};