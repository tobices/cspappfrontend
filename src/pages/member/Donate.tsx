import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Heart } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { donationAPI } from '../../services/api';
import { DonationFormData } from '../../types';
import { donationSchema } from '../../utils/validations';

const presetAmounts = [1000, 5000, 10000, 25000, 50000];
const purposes = ['Tithe', 'Offering', 'Project', 'Thanksgiving', 'Building Fund', 'Mission'];

export const Donate: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      purpose: '',
      paymentMethod: 'paystack',
    },
  });

  const amount = watch('amount');

  const onSubmit = async (data: DonationFormData) => {
    setIsProcessing(true);
    try {
      const response = await donationAPI.initialize({
        amount: data.amount,
        purpose: data.purpose,
        paymentMethod: data.paymentMethod,
      });

      const { authorizationUrl, reference } = response.data.data;

      // Redirect to Paystack payment page
      window.location.href = authorizationUrl;

      // Store reference for verification
      localStorage.setItem('pendingDonation', reference);
    } catch (error: any) {
      console.error('Donation error:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize donation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
          <Heart className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Make a Donation</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your generosity helps us serve God's purpose
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Donation Amount *
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setValue('amount', preset)}
                  className={`py-2 px-3 rounded-lg border transition-all ${amount === preset
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-600'
                    }`}
                >
                  ₦{preset.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                className="input-field pl-10"
                placeholder="Or enter custom amount"
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          {/* Purpose Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Donation Purpose *
            </label>
            <select {...register('purpose')} className="input-field">
              <option value="">Select purpose</option>
              {purposes.map((purpose) => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
            {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>}
          </div>

          {/* Payment Method Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  value="paystack"
                  {...register('paymentMethod')}
                  className="mr-3"
                />
                <span className="flex-1">Paystack (Card/Bank Transfer)</span>
                <img src="/paystack-logo.png" alt="Paystack" className="h-6" />
              </label>
            </div>
            {errors.paymentMethod && <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </form>
      </div>
    </div>
  );
};