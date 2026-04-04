import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registrationSchema } from '../../utils/validations';
import { useAuth } from '../../context/AuthContext';
import { Church, User, Mail, Phone, MapPin, GraduationCap, BookOpen, Users, Lock } from 'lucide-react';
import { RegistrationFormData } from '../../types';

const units = ['Choir', 'Ushering', 'Media', 'Prayer', 'Youth', 'Evangelism', 'Children', 'Technical'];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    const { confirmPassword, ...userData } = data;
    const success = await registerUser(userData);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gold-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="bg-primary-600 dark:bg-primary-800 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Church className="w-10 h-10 text-primary-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">Join Our Church Family</h2>
            <p className="mt-2 text-primary-100">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('fullName')}
                    className="input-field"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    className="input-field"
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('phoneNumber')}
                    className="input-field"
                    placeholder="+234 801 234 5678"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permanent Address *
                  </label>
                  <input
                    {...register('permanentAddress')}
                    className="input-field"
                    placeholder="123 Main Street, City, Country"
                  />
                  {errors.permanentAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.permanentAddress.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Residential Address *
                  </label>
                  <input
                    {...register('residentialAddress')}
                    className="input-field"
                    placeholder="456 Oak Avenue, City, Country"
                  />
                  {errors.residentialAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.residentialAddress.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Church Information Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary-600" />
                Church Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year of Graduation *
                  </label>
                  <input
                    {...register('graduationYear')}
                    type="text"
                    className="input-field"
                    placeholder="2020"
                  />
                  {errors.graduationYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course of Study *
                  </label>
                  <input
                    {...register('courseOfStudy')}
                    className="input-field"
                    placeholder="Computer Science"
                  />
                  {errors.courseOfStudy && (
                    <p className="mt-1 text-sm text-red-600">{errors.courseOfStudy.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit/Ministry Membership *
                  </label>
                  <select {...register('unit')} className="input-field">
                    <option value="">Select a unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-primary-600" />
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
                Already have an account? Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};