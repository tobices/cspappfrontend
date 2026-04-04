import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getEvents, saveEvents } from '../../data/mockData';
import { Event } from '../../types';
import { eventSchema } from '../../utils/validations';
import { Calendar, MapPin, Clock, Edit2, Trash2, Plus } from 'lucide-react';
import { formatDateTime, generateId } from '../../utils/helpers';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

type EventFormData = {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
};

export const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const allEvents = getEvents();
    setEvents(allEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  };

  const onSubmit = async (data: EventFormData) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...data }
          : event
      );
      saveEvents(updatedEvents);
      setEvents(updatedEvents);
      toast.success('Event updated successfully');
    } else {
      // Create new event
      const newEvent: Event = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
      };
      const updatedEvents = [...events, newEvent];
      saveEvents(updatedEvents);
      setEvents(updatedEvents);
      toast.success('Event created successfully');
    }
    
    reset();
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e.id !== id);
      saveEvents(updatedEvents);
      setEvents(updatedEvents);
      toast.success('Event deleted successfully');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    reset(event);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events Management</h1>
        <button
          onClick={() => {
            setEditingEvent(null);
            reset({ title: '', date: '', time: '', venue: '', description: '' });
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-gold-500 p-4">
              <h3 className="text-lg font-bold text-white">{event.title}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDateTime(event.date, event.time)}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                {event.venue}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{event.description}</p>
              <div className="flex gap-2 pt-3 border-t dark:border-gray-700">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title *</label>
                  <input {...register('title')} className="input-field" />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input {...register('date')} type="date" className="input-field" />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time *</label>
                  <input {...register('time')} type="time" className="input-field" />
                  {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Venue *</label>
                  <input {...register('venue')} className="input-field" />
                  {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea {...register('description')} rows={3} className="input-field" />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>
                
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary">
                    {isSubmitting ? 'Saving...' : 'Save Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};