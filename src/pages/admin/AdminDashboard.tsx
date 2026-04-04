import React, { useState, useEffect } from 'react';
import { getUsers, getDonations, getEvents } from '../../data/mockData';
import { Users, DollarSign, Calendar, TrendingUp, Gift } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalDonationsMonth: 0,
    totalDonationsYear: 0,
    upcomingBirthdays: [] as any[],
    recentDonations: [] as any[],
  });

  useEffect(() => {
    const loadData = () => {
      const users = getUsers();
      const members = users.filter(u => u.role === 'member');
      const donations = getDonations();
      const events = getEvents();
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthDonations = donations
        .filter(d => new Date(d.createdAt).getMonth() === currentMonth && d.status === 'completed')
        .reduce((sum, d) => sum + d.amount, 0);
      
      const yearDonations = donations
        .filter(d => new Date(d.createdAt).getFullYear() === currentYear && d.status === 'completed')
        .reduce((sum, d) => sum + d.amount, 0);
      
      // Get upcoming birthdays this week
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const upcomingBirthdays = members.filter(member => {
        const birthDate = new Date(member.dateOfBirth);
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        return thisYearBirthday >= today && thisYearBirthday <= nextWeek;
      });
      
      const recentDonations = donations
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setStats({
        totalMembers: members.length,
        totalDonationsMonth: monthDonations,
        totalDonationsYear: yearDonations,
        upcomingBirthdays,
        recentDonations,
      });
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalDonationsMonth)}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalDonationsYear)}</p>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Donations</h3>
          {stats.recentDonations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No donations yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentDonations.map((donation) => {
                const donor = getUsers().find(u => u.id === donation.userId);
                return (
                  <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{donor?.fullName}</p>
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
            <div className="space-y-3">
              {stats.upcomingBirthdays.map((member) => (
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
    </div>
  );
};