import { User, Donation, Event, Communication } from '../types';

const STORAGE_KEYS = {
  USERS: 'cspapp_users',
  DONATIONS: 'cspapp_donations',
  EVENTS: 'cspapp_events',
  COMMUNICATIONS: 'cspapp_communications',
  CURRENT_USER: 'cspapp_current_user',
  SETTINGS: 'cspapp_settings',
};

class StorageService {
  // Users
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  deleteUser(userId: string): void {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);
  }

  getUserById(userId: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.id === userId);
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  // Donations
  getDonations(): Donation[] {
    const data = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    return data ? JSON.parse(data) : [];
  }

  saveDonations(donations: Donation[]): void {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  }

  addDonation(donation: Donation): void {
    const donations = this.getDonations();
    donations.push(donation);
    this.saveDonations(donations);
  }

  getDonationsByUser(userId: string): Donation[] {
    const donations = this.getDonations();
    return donations.filter(d => d.userId === userId);
  }

  getDonationsByDateRange(startDate: Date, endDate: Date): Donation[] {
    const donations = this.getDonations();
    return donations.filter(d => {
      const date = new Date(d.createdAt);
      return date >= startDate && date <= endDate;
    });
  }

  // Events
  getEvents(): Event[] {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  }

  saveEvents(events: Event[]): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  addEvent(event: Event): void {
    const events = this.getEvents();
    events.push(event);
    this.saveEvents(events);
  }

  updateEvent(eventId: string, updates: Partial<Event>): void {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates };
      this.saveEvents(events);
    }
  }

  deleteEvent(eventId: string): void {
    const events = this.getEvents();
    const filtered = events.filter(e => e.id !== eventId);
    this.saveEvents(filtered);
  }

  getUpcomingEvents(): Event[] {
    const events = this.getEvents();
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Communications
  getCommunications(): Communication[] {
    const data = localStorage.getItem(STORAGE_KEYS.COMMUNICATIONS);
    return data ? JSON.parse(data) : [];
  }

  saveCommunications(communications: Communication[]): void {
    localStorage.setItem(STORAGE_KEYS.COMMUNICATIONS, JSON.stringify(communications));
  }

  addCommunication(communication: Communication): void {
    const communications = this.getCommunications();
    communications.push(communication);
    this.saveCommunications(communications);
  }

  // Current User
  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Settings
  getSettings(): any {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  }

  saveSettings(settings: any): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Export all data
  exportAllData(): string {
    const data = {
      users: this.getUsers(),
      donations: this.getDonations(),
      events: this.getEvents(),
      communications: this.getCommunications(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data
  importAllData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.users) this.saveUsers(data.users);
      if (data.donations) this.saveDonations(data.donations);
      if (data.events) this.saveEvents(data.events);
      if (data.communications) this.saveCommunications(data.communications);
      if (data.settings) this.saveSettings(data.settings);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid data format');
    }
  }
}

export const storage = new StorageService();