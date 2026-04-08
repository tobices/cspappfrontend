import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Save } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';

const profileSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  permanentAddress: z.string().min(5, 'Address is required'),
  residentialAddress: z.string().min(5, 'Address is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const AdminProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      permanentAddress: user?.permanentAddress || '',
      residentialAddress: user?.residentialAddress || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    console.log('=== ADMIN PROFILE UPDATE ===');
    console.log('Current user object:', user);

    // Get the user ID from the user object (could be id or _id)
    const userId = user?.id || user?._id;
    console.log('User ID to update:', userId);

    if (!userId) {
      console.error('No user ID found in:', user);
      toast.error('Cannot update: User ID not found. Please logout and login again.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Updating admin profile with ID:', userId);
      console.log('Update data:', data);

      const response = await userAPI.updateProfile(userId, data);
      console.log('Update response:', response.data);

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);

        // Refresh user data in localStorage
        const profileResponse = await userAPI.getProfile();
        const updatedUser = profileResponse.data.data.user;
        console.log('Updated user from server:', updatedUser);

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update auth context if updateUser function exists
        if (updateUser) {
          await updateUser(userId, data);
        }
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">User data not found. Please logout and login again.</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="btn-primary mt-4"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                {...register('fullName')}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                value={user.email || ''}
                disabled
                className="input-field bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                {...register('phoneNumber')}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <input
                value={user.role === 'admin' ? 'Administrator' : user.role || 'Member'}
                disabled
                className="input-field bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permanent Address *
              </label>
              <input
                {...register('permanentAddress')}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              {errors.permanentAddress && <p className="mt-1 text-sm text-red-600">{errors.permanentAddress.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Residential Address *
              </label>
              <input
                {...register('residentialAddress')}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              {errors.residentialAddress && <p className="mt-1 text-sm text-red-600">{errors.residentialAddress.message}</p>}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};