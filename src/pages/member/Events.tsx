import { Calendar, MapPin, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { eventAPI } from '../../services/api';
import { Event } from '../../types';
import { formatDateTime } from '../../utils/helpers';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getAllEvents();
      const allEvents = response.data.data.events;
      // Map _id to id for consistency
      const mappedEvents = allEvents.map((event: any) => ({
        ...event,
        id: event._id || event.id
      }));
      setEvents(mappedEvents);
      setFilteredEvents(mappedEvents);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by upcoming/past
    const now = new Date();
    if (filter === 'upcoming') {
      filtered = filtered.filter(e => new Date(e.date) >= now);
    } else if (filter === 'past') {
      filtered = filtered.filter(e => new Date(e.date) < now);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Church Events</h1>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="input-field w-32"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-primary-500 to-gold-500 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDateTime(event.date, event.time)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.venue}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};