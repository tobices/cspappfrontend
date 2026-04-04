import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, Edit2 } from 'lucide-react';
import { z } from 'zod';

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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName,
      phoneNumber: user?.phoneNumber,
      permanentAddress: user?.permanentAddress,
      residentialAddress: user?.residentialAddress,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (user) {
      updateUser(user.id, data);
      setIsEditing(false);
    }
  };

  if (!user) return null;

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
              <input value={user.email} disabled className="input-field bg-gray-100 dark:bg-gray-700" />
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
              <input value="Administrator" disabled className="input-field bg-gray-100 dark:bg-gray-700" />
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
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};