import React, { useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataTable } from '../../components/tables/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { getUsers, saveUsers } from '../../data/mockData';
import { User, RegistrationFormData } from '../../types';
import { Eye, Edit2, Trash2, UserPlus, Download } from 'lucide-react';
import { formatDate, generateId } from '../../utils/helpers';
import { registrationSchema } from '../../utils/validations';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const columnHelper = createColumnHelper<User>();

const units = ['Choir', 'Ushering', 'Media', 'Prayer', 'Youth', 'Evangelism', 'Children', 'Technical'];

export const Members: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingMember, setViewingMember] = useState<User | null>(null);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    const users = getUsers();
    setMembers(users.filter(u => u.role === 'member'));
    setLoading(false);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    const { confirmPassword, ...userData } = data;
    
    if (editingMember) {
      // Update existing member
      const updatedMembers = members.map(member =>
        member.id === editingMember.id
          ? { ...member, ...userData }
          : member
      );
      const allUsers = getUsers();
      const updatedAllUsers = allUsers.map(u =>
        u.id === editingMember.id ? { ...u, ...userData } : u
      );
      saveUsers(updatedAllUsers);
      setMembers(updatedMembers);
      toast.success('Member updated successfully');
    } else {
      // Check if email already exists
      const existingUser = getUsers().find(u => u.email === userData.email);
      if (existingUser) {
        toast.error('User with this email already exists');
        return;
      }
      
      // Create new member
      const newMember: User = {
        ...userData,
        id: generateId(),
        role: 'member',
        createdAt: new Date().toISOString(),
      };
      const allUsers = getUsers();
      allUsers.push(newMember);
      saveUsers(allUsers);
      setMembers([...members, newMember]);
      toast.success('Member added successfully');
    }
    
    reset();
    setShowModal(false);
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const updatedMembers = members.filter(m => m.id !== id);
      const allUsers = getUsers();
      const updatedAllUsers = allUsers.filter(u => u.id !== id);
      saveUsers(updatedAllUsers);
      setMembers(updatedMembers);
      toast.success('Member deleted successfully');
    }
  };

  const handleEdit = (member: User) => {
    setEditingMember(member);
    reset({
      fullName: member.fullName,
      email: member.email,
      dateOfBirth: member.dateOfBirth,
      phoneNumber: member.phoneNumber,
      permanentAddress: member.permanentAddress,
      residentialAddress: member.residentialAddress,
      graduationYear: member.graduationYear,
      courseOfStudy: member.courseOfStudy,
      unit: member.unit,
      password: member.password,
      confirmPassword: member.password,
    });
    setShowModal(true);
  };

  const handleExport = () => {
    const csvData = members.map(m => ({
      'Full Name': m.fullName,
      Email: m.email,
      Phone: m.phoneNumber,
      'Date of Birth': formatDate(m.dateOfBirth),
      Unit: m.unit,
      'Graduation Year': m.graduationYear,
      'Course of Study': m.courseOfStudy,
      'Permanent Address': m.permanentAddress,
      'Residential Address': m.residentialAddress,
      'Member Since': formatDate(m.createdAt),
    }));
    
    const headers = Object.keys(csvData[0]);
    const csv = [headers.join(','), ...csvData.map(row => headers.map(h => row[h as keyof typeof row]).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members_${formatDate(new Date().toISOString())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Members exported successfully');
  };

  const columns = [
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('phoneNumber', {
      header: 'Phone',
    }),
    columnHelper.accessor('dateOfBirth', {
      header: 'DOB',
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('unit', {
      header: 'Unit',
    }),
    columnHelper.accessor('graduationYear', {
      header: 'Grad Year',
    }),
    {
      id: 'actions',
      header: 'Actions',
      cell: (info: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => setViewingMember(info.row.original)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(info.row.original)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Edit Member"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Delete Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Members Management</h1>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => {
              setEditingMember(null);
              reset({
                fullName: '',
                email: '',
                dateOfBirth: '',
                phoneNumber: '',
                permanentAddress: '',
                residentialAddress: '',
                graduationYear: '',
                courseOfStudy: '',
                unit: '',
                password: '',
                confirmPassword: '',
              });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={members}
        searchKey="fullName"
        searchPlaceholder="Search by name, email, or phone..."
      />

      {/* Add/Edit Member Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMember(null);
          reset();
        }}
        title={editingMember ? 'Edit Member' : 'Add New Member'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName?.message}
              placeholder="John Doe"
            />
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="john@example.com"
            />
            <Input
              label="Date of Birth"
              type="date"
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
            />
            <Input
              label="Phone Number"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
              placeholder="+234 801 234 5678"
            />
            <Input
              label="Permanent Address"
              {...register('permanentAddress')}
              error={errors.permanentAddress?.message}
              placeholder="123 Main Street"
              className="md:col-span-2"
            />
            <Input
              label="Residential Address"
              {...register('residentialAddress')}
              error={errors.residentialAddress?.message}
              placeholder="456 Oak Avenue"
              className="md:col-span-2"
            />
            <Input
              label="Year of Graduation"
              {...register('graduationYear')}
              error={errors.graduationYear?.message}
              placeholder="2020"
            />
            <Input
              label="Course of Study"
              {...register('courseOfStudy')}
              error={errors.courseOfStudy?.message}
              placeholder="Computer Science"
            />
            <Select
              label="Unit/Ministry"
              {...register('unit')}
              error={errors.unit?.message}
              options={[
                { value: '', label: 'Select a unit' },
                ...units.map(unit => ({ value: unit, label: unit }))
              ]}
            />
            {!editingMember && (
              <>
                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="••••••••"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  placeholder="••••••••"
                />
              </>
            )}
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingMember(null);
                reset();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Member Modal */}
      <Modal
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
        title="Member Details"
        size="lg"
      >
        {viewingMember && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                <p className="text-gray-900 dark:text-white mt-1">{formatDate(viewingMember.dateOfBirth)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Permanent Address</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.permanentAddress}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Residential Address</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.residentialAddress}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Graduation Year</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.graduationYear}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Course of Study</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.courseOfStudy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Unit/Ministry</label>
                <p className="text-gray-900 dark:text-white mt-1">{viewingMember.unit}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</label>
                <p className="text-gray-900 dark:text-white mt-1">{formatDate(viewingMember.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setViewingMember(null)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};