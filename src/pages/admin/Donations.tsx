import { createColumnHelper } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '../../components/tables/DataTable';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { donationAPI } from '../../services/api';
import { Donation } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface DonationWithUser extends Donation {
  userName: string;
  userEmail: string;
  userPhone: string;
}

const columnHelper = createColumnHelper<DonationWithUser>();

export const Donations: React.FC = () => {
  const [donations, setDonations] = useState<DonationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalDonations: 0
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const response = await donationAPI.getAllDonations();
      console.log('Donations response:', response.data);

      const allDonations = response.data.data.donations;
      const summaryData = response.data.data.summary;

      // Map donations to include user details
      const mappedDonations = allDonations.map((donation: any) => ({
        ...donation,
        id: donation._id || donation.id,
        userName: donation.user?.fullName || 'Unknown',
        userEmail: donation.user?.email || 'Unknown',
        userPhone: donation.user?.phoneNumber || 'Unknown'
      }));

      setDonations(mappedDonations);
      setSummary(summaryData);
      setTotalAmount(summaryData.totalAmount || 0);

    } catch (error: any) {
      console.error('Error loading donations:', error);
      toast.error(error.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await donationAPI.exportDonations();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `donations_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Donations exported successfully');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.message || 'Failed to export donations');
    }
  };

  const columns = [
    columnHelper.accessor('userName', {
      header: 'Member Name',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('userEmail', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('purpose', {
      header: 'Purpose',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 text-xs rounded-full ${info.getValue() === 'completed'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : info.getValue() === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('paymentMethod', {
      header: 'Payment Method',
      cell: info => info.getValue().replace('_', ' ').toUpperCase(),
    }),
    columnHelper.accessor('transactionId', {
      header: 'Transaction ID',
      cell: info => info.getValue() || '-',
    }),
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Donations Management</h1>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Donations</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(summary.totalAmount)}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{donations.length}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed Donations</p>
          <p className="text-2xl font-bold text-green-600">{donations.filter(d => d.status === 'completed').length}</p>
        </div>
      </div>

      {/* Donations Table */}
      <DataTable
        columns={columns}
        data={donations}
        searchKey="userName"
        searchPlaceholder="Search by member name, email, or purpose..."
      />
    </div>
  );
};