import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                const { token } = response.data.data;
                localStorage.setItem('token', token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData: any) => api.post('/auth/register', userData),
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
    refreshToken: (refreshToken: string) => api.post('/auth/refresh-token', { refreshToken }),
    changePassword: (currentPassword: string, newPassword: string) =>
        api.post('/auth/change-password', { currentPassword, newPassword }),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, newPassword: string) =>
        api.post('/auth/reset-password', { token, newPassword }),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (id: string, data: any) => {
        console.log('API - Updating user with ID:', id);
        if (!id) {
            console.error('Cannot update: ID is undefined');
            return Promise.reject(new Error('User ID is required'));
        }
        return api.put(`/users/${id}`, data);
    },
    getAllUsers: (params?: any) => api.get('/users', { params }),
    getUserById: (id: string) => api.get(`/users/${id}`),
    deleteUser: (id: string) => {
        console.log('API - Deleting user with ID:', id);
        if (!id) {
            console.error('Cannot delete: ID is undefined');
            return Promise.reject(new Error('User ID is required'));
        }
        return api.delete(`/users/${id}`);
    },
    getUserStats: () => api.get('/users/stats'),
    exportUsers: () => api.get('/users/export', { responseType: 'blob' }),
};

// Donation API
export const donationAPI = {
    initialize: (data: { amount: number; purpose: string; paymentMethod: string }) =>
        api.post('/donations/initialize', data),
    verify: (reference: string) => {
        console.log('Verifying donation with reference:', reference);
        return api.get(`/donations/verify/${reference}`);
    },
    getMyDonations: (params?: any) => api.get('/donations/my-donations', { params }),
    getAllDonations: (params?: any) => api.get('/donations', { params }),
    getStats: () => api.get('/donations/stats'),
    exportDonations: () => api.get('/donations/export', { responseType: 'blob' }),
};

// Event API
export const eventAPI = {
    getAllEvents: (params?: any) => api.get('/events', { params }),
    getEventById: (id: string) => api.get(`/events/${id}`),
    createEvent: (data: any) => api.post('/events', data),
    updateEvent: (id: string, data: any) => {
        console.log('API - Updating event:', id, data);
        if (!id) {
            console.error('Cannot update: Event ID is undefined');
            return Promise.reject(new Error('Event ID is required'));
        }
        return api.put(`/events/${id}`, data);
    },
    deleteEvent: (id: string) => {
        console.log('API - Deleting event:', id);
        if (!id) {
            console.error('Cannot delete: Event ID is undefined');
            return Promise.reject(new Error('Event ID is required'));
        }
        return api.delete(`/events/${id}`);
    },
    registerForEvent: (id: string) => api.post(`/events/${id}/register`),
    getEventAttendees: (id: string) => api.get(`/events/${id}/attendees`),
};

// Communications API
export const commsAPI = {
    sendEmail: (data: { subject: string; message: string; recipientGroups: string[]; customRecipients?: string[] }) =>
        api.post('/comms/email', data),
    sendSMS: (data: { message: string; recipientGroups: string[]; customRecipients?: string[] }) =>
        api.post('/comms/sms', data),
    sendBirthdayWishes: () => api.post('/comms/birthday'),
    getHistory: () => api.get('/comms/history'),
};

export default api;