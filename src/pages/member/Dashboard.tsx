import { Calendar, DollarSign, Heart, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { donationAPI, eventAPI } from '../../services/api';
import { Donation, Event } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load donations
      const donationsResponse = await donationAPI.getMyDonations();
      const userDonations = donationsResponse.data.data.donations;
      const currentYearDonations = userDonations.filter(
        (d: Donation) => new Date(d.createdAt).getFullYear() === new Date().getFullYear()
      );
      const total = currentYearDonations.reduce((sum: number, d: Donation) => sum + d.amount, 0);

      setDonations(userDonations);
      setTotalDonations(total);

      // Load upcoming events
      const eventsResponse = await eventAPI.getAllEvents({ upcoming: 'true' });
      const upcomingEvents = eventsResponse.data.data.events.slice(0, 3);
      setEvents(upcomingEvents);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.fullName?.split(' ')[0]}! 🙏
        </h1>
        <p className="text-primary-100">May God's grace be upon you today and always.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Donations (This Year)</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalDonations)}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gold-100 dark:bg-gold-900 rounded-lg">
              <Calendar className="w-6 h-6 text-gold-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Events</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{events.length}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Donations Count</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {donations.filter(d => new Date(d.createdAt).getFullYear() === new Date().getFullYear()).length}
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No upcoming events at the moment.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border-l-4 border-gold-500 pl-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-lg transition-all">
                <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formatDateTime(event.date, event.time)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.venue}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};