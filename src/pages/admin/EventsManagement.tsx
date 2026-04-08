import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Edit2, MapPin, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { eventAPI } from '../../services/api';
import { Event } from '../../types';
import { formatDateTime } from '../../utils/helpers';
import { eventSchema } from '../../utils/validations';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getAllEvents();
      console.log('Events response:', response.data);
      const eventsData = response.data.data.events;
      // Map _id to id for consistency
      const mappedEvents = eventsData.map((event: any) => ({
        ...event,
        id: event._id || event.id
      }));
      setEvents(mappedEvents);
    } catch (error: any) {
      console.error('Load events error:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    console.log('=== FORM SUBMITTED ===');
    console.log('Editing event:', editingEvent);
    console.log('Form data:', data);

    setIsSubmitting(true);
    try {
      if (editingEvent) {
        const eventId = editingEvent.id || editingEvent._id;
        console.log('Updating event ID:', eventId);

        if (!eventId) {
          toast.error('Cannot update: Event ID is missing');
          return;
        }

        const response = await eventAPI.updateEvent(eventId, data);
        console.log('Update response:', response.data);

        if (response.data.success) {
          toast.success('Event updated successfully');
          await loadEvents();
          reset();
          setShowModal(false);
          setEditingEvent(null);
        } else {
          toast.error(response.data.message || 'Failed to update event');
        }
      } else {
        const response = await eventAPI.createEvent(data);
        console.log('Create response:', response.data);

        if (response.data.success) {
          toast.success('Event created successfully');
          await loadEvents();
          reset();
          setShowModal(false);
        } else {
          toast.error(response.data.message || 'Failed to create event');
        }
      }
    } catch (error: any) {
      console.error('Event save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Delete function called with ID:', id);

    if (!id) {
      toast.error('Cannot delete: Event ID is missing');
      return;
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log('Deleting event ID:', id);
        const response = await eventAPI.deleteEvent(id);
        console.log('Delete response:', response.data);

        if (response.data.success) {
          toast.success('Event deleted successfully');
          await loadEvents();
        } else {
          toast.error(response.data.message || 'Failed to delete event');
        }
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const handleEdit = (event: Event) => {
    console.log('Editing event:', event);
    const eventId = event.id || event._id;
    console.log('Event ID for edit:', eventId);

    setEditingEvent(event);
    reset({
      title: event.title,
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time || '',
      venue: event.venue,
      description: event.description,
    });
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
        {events && events.map((event) => {
          const eventId = event.id || event._id;
          console.log('Rendering event with ID:', eventId);
          return (
            <div key={eventId} className="card overflow-hidden">
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
                    onClick={() => handleDelete(eventId)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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