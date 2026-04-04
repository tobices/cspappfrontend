import React, { useState } from 'react';
import { X, CreditCard, Building2, Lock, CheckCircle } from 'lucide-react';
import { User, DonationFormData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { saveDonations, getDonations } from '../../data/mockData';
import { generateId, formatCurrency } from '../../utils/helpers';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationData: DonationFormData;
  user: User;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, donationData, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create donation record
    const newDonation = {
      id: generateId(),
      userId: user.id,
      amount: donationData.amount,
      purpose: donationData.purpose,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      paymentMethod: donationData.paymentMethod,
      transactionId: `TXN-${Date.now()}`,
    };

    const donations = getDonations();
    donations.push(newDonation);
    saveDonations(donations);

    setIsProcessing(false);
    toast.success('Payment successful! Thank you for your donation.');
    onClose();

    // Redirect to donation history after short delay
    setTimeout(() => {
      window.location.href = '/donation-history';
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Complete Your Donation</h3>
              <button onClick={onClose} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="mb-6">
              <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Donation Amount</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(donationData.amount)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Purpose: {donationData.purpose}</p>
              </div>
            </div>

            {donationData.paymentMethod === 'card' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4 mr-1" />
                  Secure payment encrypted
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <Building2 className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Bank Transfer Details</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Account Name: CSPAPP Church<br />
                    Account Number: 0123456789<br />
                    Bank: Example Bank<br />
                    Reference: {`DON-${Date.now()}`}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please transfer the exact amount and use the reference code. Your donation will be verified within 24 hours.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Pay Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;