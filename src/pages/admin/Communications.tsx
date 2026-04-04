import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { communicationSchema } from '../../utils/validations';
import { getUsers } from '../../data/mockData';
import { Mail, Smartphone, Users, Calendar as CalendarIcon, Send } from 'lucide-react';
import { toast } from 'sonner';

type CommunicationFormData = {
  subject: string;
  message: string;
  recipients: string[];
};

export const Communications: React.FC = () => {
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationSchema),
  });

  const onSubmit = async (data: CommunicationFormData) => {
    // Simulate sending communication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const users = getUsers();
    let recipientList: string[] = [];
    
    if (data.recipients.includes('all')) {
      recipientList = users.map(u => u.email);
    } else if (data.recipients.includes('birthdays')) {
      const today = new Date();
      recipientList = users
        .filter(u => {
          const birthDate = new Date(u.dateOfBirth);
          return birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate();
        })
        .map(u => u.email);
    } else {
      recipientList = data.recipients;
    }
    
    toast.success(`${communicationType === 'email' ? 'Email' : 'SMS'} sent successfully to ${recipientList.length} recipients`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communications</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mass Communication Form */}
        <div className="card p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCommunicationType('email')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                communicationType === 'email'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Mass Email
            </button>
            <button
              onClick={() => setCommunicationType('sms')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                communicationType === 'sms'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Smartphone className="w-4 h-4 inline mr-2" />
              Mass SMS
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <input {...register('subject')} className="input-field" placeholder="Enter subject" />
              {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea
                {...register('message')}
                rows={6}
                className="input-field"
                placeholder={communicationType === 'email' ? 'Write your email message here...' : 'Write your SMS message here...'}
              />
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Recipients *</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" value="all" {...register('recipients')} className="mr-2" />
                  <span>All Members</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" value="birthdays" {...register('recipients')} className="mr-2" />
                  <span>Birthdays This Month</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" value="choir" {...register('recipients')} className="mr-2" />
                  <span>Choir Unit</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" value="ushering" {...register('recipients')} className="mr-2" />
                  <span>Ushering Unit</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" value="media" {...register('recipients')} className="mr-2" />
                  <span>Media Unit</span>
                </label>
              </div>
              {errors.recipients && <p className="mt-1 text-sm text-red-600">{errors.recipients.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : `Send ${communicationType === 'email' ? 'Email' : 'SMS'}`}
            </button>
          </form>
        </div>

        {/* Automated Birthday Emails Toggle */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
            Automated Birthday Emails
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Enable automated birthday emails</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            When enabled, the system will automatically send birthday祝福 emails to members on their special day.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium mb-2">Preview Birthday Message:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subject: Happy Birthday! 🎉<br />
              Message: Dear [Member Name],<br /><br />
              Happy Birthday! May God's blessings be upon you today and always. We celebrate you and thank God for your life.<br /><br />
              Your CSPAPP Church Family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};