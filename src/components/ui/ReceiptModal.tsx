import React, { useRef } from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import { Donation, User } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Church } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation;
  user: User;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, donation, user }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Donation Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .receipt { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .content { margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Donation Receipt</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="text-white hover:text-gray-200">
                  <Printer className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div ref={receiptRef} className="p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Church className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CSPAPP Church</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Official Donation Receipt</p>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receipt Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{donation.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatDate(donation.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Donor Information</h3>
              <p className="text-gray-700 dark:text-gray-300">{user.fullName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.phoneNumber}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Donation Purpose</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{donation.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(donation.amount)}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                <p className="capitalize text-gray-900 dark:text-white">{donation.paymentMethod.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thank you for your generous donation!<br />
                May God richly bless you.
              </p>
            </div>

            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>This is an official receipt issued by CSPAPP Church.</p>
              <p>For any inquiries, please contact us at support@cspapp.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;