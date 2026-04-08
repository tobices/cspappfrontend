import { DollarSign, Gift, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { donationAPI, userAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface DashboardStats {
  totalMembers: number;
  totalDonationsMonth: number;
  totalDonationsYear: number;
  upcomingBirthdays: any[];
  recentDonations: any[];
  byPurpose: any[];
}

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalDonationsMonth: 0,
    totalDonationsYear: 0,
    upcomingBirthdays: [],
    recentDonations: [],
    byPurpose: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get users
      const usersResponse = await userAPI.getAllUsers({ limit: 1000 });
      const allUsers = usersResponse.data.data.users;
      const members = allUsers.filter((u: any) => u.role === 'member');
      const totalMembers = members.length;

      // Get donation stats
      const statsResponse = await donationAPI.getStats();
      console.log('Donation stats response:', statsResponse.data);

      const donationStats = statsResponse.data.data;

      // Get current month and year totals from the API response
      const totalDonationsMonth = donationStats.currentMonthTotal || 0;
      const totalDonationsYear = donationStats.currentYearTotal || 0;

      console.log('Monthly total:', totalDonationsMonth);
      console.log('Yearly total:', totalDonationsYear);

      // Get upcoming birthdays (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const upcomingBirthdays = members.filter((member: any) => {
        if (!member.dateOfBirth) return false;
        const birthDate = new Date(member.dateOfBirth);
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        return thisYearBirthday >= today && thisYearBirthday <= nextWeek;
      }).map((member: any) => ({
        ...member,
        id: member._id || member.id
      }));

      // Get recent donations
      const recentDonations = donationStats.recentDonations || [];

      setStats({
        totalMembers,
        totalDonationsMonth,
        totalDonationsYear,
        upcomingBirthdays,
        recentDonations,
        byPurpose: donationStats.byPurpose || [],
      });

    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalMembers}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">This Month's Donations</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(stats.totalDonationsMonth)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yearly Donations</p>
              <p className="text-2xl font-bold text-gold-600 dark:text-gold-400 mt-1">
                {formatCurrency(stats.totalDonationsYear)}
              </p>
            </div>
            <div className="p-3 bg-gold-100 dark:bg-gold-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-gold-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Birthdays</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.upcomingBirthdays.length}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations & Upcoming Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Donations</h3>
          {stats.recentDonations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No donations yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.recentDonations.map((donation: any) => {
                const donor = donation.user || { fullName: 'Unknown' };
                return (
                  <div key={donation._id || donation.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{donor.fullName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{donation.purpose}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">{formatCurrency(donation.amount)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Birthdays */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Birthdays This Week</h3>
          {stats.upcomingBirthdays.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No birthdays this week</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.upcomingBirthdays.map((member: any) => (
                <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{member.fullName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold-600">
                      {new Date(member.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donation by Purpose Chart */}
      {stats.byPurpose.length > 0 && stats.totalDonationsYear > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Donations by Purpose</h3>
          <div className="space-y-4">
            {stats.byPurpose.map((purpose: any) => (
              <div key={purpose._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{purpose._id}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(purpose.total)} ({purpose.count} donations)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min((purpose.total / stats.totalDonationsYear) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};