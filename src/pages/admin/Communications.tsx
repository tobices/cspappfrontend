import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Mail, Send, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { commsAPI } from '../../services/api';

// Separate schemas for email and SMS
const emailSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  recipients: z.array(z.string()).min(1, 'Select at least one recipient'),
});

const smsSchema = z.object({
  message: z.string().min(3, 'Message is required').max(905, 'SMS message cannot exceed 905 characters'),
  recipients: z.array(z.string()).min(1, 'Select at least one recipient'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type SMSFormData = z.infer<typeof smsSchema>;

export const Communications: React.FC = () => {
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');
  const [isSending, setIsSending] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: '',
      message: '',
      recipients: [],
    },
  });

  const smsForm = useForm<SMSFormData>({
    resolver: zodResolver(smsSchema),
    defaultValues: {
      message: '',
      recipients: [],
    },
  });

  const onSubmitEmail = async (data: EmailFormData) => {
    setIsSending(true);
    try {
      const response = await commsAPI.sendEmail({
        subject: data.subject,
        message: data.message,
        recipientGroups: data.recipients,
      });

      toast.success(`Email sent successfully to ${response.data.data.recipientsCount} recipients`);
      emailForm.reset();
    } catch (error: any) {
      console.error('Email error:', error);
      toast.error(error.response?.data?.message || 'Failed to send emails');
    } finally {
      setIsSending(false);
    }
  };

  const onSubmitSMS = async (data: SMSFormData) => {
    setIsSending(true);
    try {
      const response = await commsAPI.sendSMS({
        message: data.message,
        recipientGroups: data.recipients,
      });

      toast.success(`SMS sent successfully to ${response.data.data.sentCount} recipients`);
      smsForm.reset();
    } catch (error: any) {
      console.error('SMS error:', error);
      toast.error(error.response?.data?.message || 'Failed to send SMS');
    } finally {
      setIsSending(false);
    }
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
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${communicationType === 'email'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Mass Email
            </button>
            <button
              onClick={() => setCommunicationType('sms')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${communicationType === 'sms'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
            >
              <Smartphone className="w-4 h-4 inline mr-2" />
              Mass SMS
            </button>
          </div>

          {/* Email Form */}
          {communicationType === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  {...emailForm.register('subject')}
                  className="input-field"
                  placeholder="Enter subject"
                />
                {emailForm.formState.errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{emailForm.formState.errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  {...emailForm.register('message')}
                  rows={6}
                  className="input-field"
                  placeholder="Write your email message here..."
                />
                {emailForm.formState.errors.message && (
                  <p className="mt-1 text-sm text-red-600">{emailForm.formState.errors.message.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Recipients *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="all"
                      {...emailForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>All Members</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="birthdays"
                      {...emailForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Birthdays This Month</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="choir"
                      {...emailForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Choir Unit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="ushering"
                      {...emailForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Ushering Unit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="media"
                      {...emailForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Media Unit</span>
                  </label>
                </div>
                {emailForm.formState.errors.recipients && (
                  <p className="mt-1 text-sm text-red-600">{emailForm.formState.errors.recipients.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSending || emailForm.formState.isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </form>
          )}

          {/* SMS Form - NO SUBJECT FIELD */}
          {communicationType === 'sms' && (
            <form onSubmit={smsForm.handleSubmit(onSubmitSMS)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message *
                  <span className="text-xs text-gray-500 ml-2">
                    (Max 905 characters)
                  </span>
                </label>
                <textarea
                  {...smsForm.register('message')}
                  rows={6}
                  className="input-field"
                  placeholder="Write your SMS message here..."
                  maxLength={905}
                />
                {smsForm.formState.errors.message && (
                  <p className="mt-1 text-sm text-red-600">{smsForm.formState.errors.message.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 text-right">
                  {smsForm.watch('message')?.length || 0}/905 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Recipients *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="all"
                      {...smsForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>All Members</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="birthdays"
                      {...smsForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Birthdays This Month</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="choir"
                      {...smsForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Choir Unit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="ushering"
                      {...smsForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Ushering Unit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="media"
                      {...smsForm.register('recipients')}
                      className="mr-2"
                    />
                    <span>Media Unit</span>
                  </label>
                </div>
                {smsForm.formState.errors.recipients && (
                  <p className="mt-1 text-sm text-red-600">{smsForm.formState.errors.recipients.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSending || smsForm.formState.isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send SMS'}
              </button>
            </form>
          )}
        </div>

        {/* Automated Birthday Emails Toggle */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
            Automated Birthday Messages
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Enable automated birthday emails</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            When enabled, the system will automatically send birthday messages to members on their special day.
          </p>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium mb-2">Preview Birthday Message:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Email Subject:</strong> Happy Birthday! 🎉<br /><br />
              <strong>Message:</strong> Dear [Member Name],<br /><br />
              Happy Birthday! May God's blessings be upon you today and always. We celebrate you and thank God for your life.<br /><br />
              Your CSPAPP Church Family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};