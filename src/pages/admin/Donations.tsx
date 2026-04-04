import React, { useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/tables/DataTable';
import { getDonations, getUsers } from '../../data/mockData';
import { Donation, User } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface DonationWithUser extends Donation {
  userName: string;
}

const columnHelper = createColumnHelper<DonationWithUser>();

export const Donations: React.FC = () => {
  const [donations, setDonations] = useState<DonationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = () => {
    const allDonations = getDonations();
    const users = getUsers();
    
    const donationsWithUser = allDonations.map(donation => ({
      ...donation,
      userName: users.find(u => u.id === donation.userId)?.fullName || 'Unknown',
    }));
    
    const total = donationsWithUser
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);
    
    setDonations(donationsWithUser);
    setTotalAmount(total);
    setLoading(false);
  };

  const columns = [
    columnHelper.accessor('userName', {
      header: 'Member Name',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('purpose', {
      header: 'Purpose',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          info.getValue() === 'completed' 
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
  ];

  const handleExport = () => {
    const csvData = donations.map(d => ({
      'Member Name': d.userName,
      Amount: d.amount,
      Purpose: d.purpose,
      Status: d.status,
      Date: formatDate(d.createdAt),
      'Payment Method': d.paymentMethod,
      'Transaction ID': d.transactionId,
    }));
    
    const headers = Object.keys(csvData[0]);
    const csv = [headers.join(','), ...csvData.map(row => headers.map(h => row[h as keyof typeof row]).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${formatDate(new Date().toISOString())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Donations exported successfully');
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Donations</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalAmount)}</p>
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

      <DataTable
        columns={columns}
        data={donations}
        searchKey="userName"
        searchPlaceholder="Search by member name or purpose..."
      />
    </div>
  );
};

export default Donations;