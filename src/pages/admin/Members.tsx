import { zodResolver } from '@hookform/resolvers/zod';
import { createColumnHelper } from '@tanstack/react-table';
import { Download, Edit2, Eye, Trash2, UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { DataTable } from '../../components/tables/DataTable';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { authAPI, userAPI } from '../../services/api';
import { RegistrationFormData, User } from '../../types';
import { formatDate } from '../../utils/helpers';
import { profileSchema, registrationSchema } from '../../utils/validations';

const columnHelper = createColumnHelper<User>();
const units = ['Choir', 'Ushering', 'Media', 'Prayer', 'Youth', 'Evangelism', 'Children', 'Technical', 'Pastoral'];

// Type for profile update (without password)
type ProfileFormData = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  permanentAddress: string;
  residentialAddress: string;
  graduationYear: string;
  courseOfStudy: string;
  unit: string;
};

export const Members: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingMember, setViewingMember] = useState<User | null>(null);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Use different forms for add and edit
  const addForm = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
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
    }
  });

  const editForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      dateOfBirth: '',
      phoneNumber: '',
      permanentAddress: '',
      residentialAddress: '',
      graduationYear: '',
      courseOfStudy: '',
      unit: '',
    }
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers();
      const allUsers = response.data.data.users;
      const mappedUsers = allUsers.map((user: any) => ({
        ...user,
        id: user._id || user.id
      }));
      setMembers(mappedUsers.filter((u: User) => u.role === 'member'));
    } catch (error: any) {
      console.error('Error loading members:', error);
      toast.error(error.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const onAddSubmit = async (data: RegistrationFormData) => {
    console.log('=== ADD FORM SUBMITTED ===');
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...userData } = data;
      const response = await authAPI.register(userData);
      if (response.data.success) {
        toast.success('Member added successfully');
        addForm.reset();
        setShowModal(false);
        await loadMembers();
      } else {
        toast.error(response.data.message || 'Failed to add member');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (data: ProfileFormData) => {
    console.log('=== EDIT FORM SUBMITTED ===');
    console.log('Edit data:', data);

    setIsSubmitting(true);
    try {
      if (editingMember) {
        const memberId = editingMember.id || editingMember._id;
        console.log('Updating member ID:', memberId);

        const response = await userAPI.updateProfile(memberId, data);
        console.log('Update response:', response.data);

        if (response.data.success) {
          toast.success('Member updated successfully');
          editForm.reset();
          setShowModal(false);
          setEditingMember(null);
          setIsEditMode(false);
          await loadMembers();
        } else {
          toast.error(response.data.message || 'Failed to update member');
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Cannot delete: Member ID is missing');
      return;
    }

    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await userAPI.deleteUser(id);
        if (response.data.success) {
          toast.success('Member deleted successfully');
          await loadMembers();
        } else {
          toast.error(response.data.message || 'Failed to delete member');
        }
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete member');
      }
    }
  };

  const handleEdit = (member: User) => {
    console.log('Opening edit modal for member:', member);
    setEditingMember(member);
    setIsEditMode(true);

    let formattedDate = '';
    if (member.dateOfBirth) {
      const date = new Date(member.dateOfBirth);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }

    const formValues = {
      fullName: member.fullName || '',
      email: member.email || '',
      dateOfBirth: formattedDate,
      phoneNumber: member.phoneNumber || '',
      permanentAddress: member.permanentAddress || '',
      residentialAddress: member.residentialAddress || '',
      graduationYear: member.graduationYear || '',
      courseOfStudy: member.courseOfStudy || '',
      unit: member.unit || '',
    };

    console.log('Resetting edit form with values:', formValues);
    editForm.reset(formValues);
    setShowModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await userAPI.exportUsers();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `members_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Members exported successfully');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.message || 'Failed to export members');
    }
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
      cell: (info: any) => {
        const member = info.row.original;
        const memberId = member.id || member._id;

        return (
          <div className="flex gap-2">
            <button
              onClick={() => setViewingMember(member)}
              className="text-blue-600 hover:text-blue-800"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(member)}
              className="text-green-600 hover:text-green-800"
              title="Edit Member"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(memberId)}
              className="text-red-600 hover:text-red-800"
              title="Delete Member"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Members Management</h1>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => {
              setIsEditMode(false);
              setEditingMember(null);
              addForm.reset({
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
            <UserPlus className="w-4 h-4" /> Add Member
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={members} searchKey="fullName" searchPlaceholder="Search by name, email, or phone..." />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingMember(null); setIsEditMode(false); addForm.reset(); editForm.reset(); }} title={isEditMode ? 'Edit Member' : 'Add New Member'} size="lg">
        {isEditMode ? (
          // Edit Form - No password fields
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" {...editForm.register('fullName')} error={editForm.formState.errors.fullName?.message} placeholder="John Doe" />
              <Input label="Email Address" type="email" {...editForm.register('email')} error={editForm.formState.errors.email?.message} placeholder="john@example.com" />
              <Input label="Date of Birth" type="date" {...editForm.register('dateOfBirth')} error={editForm.formState.errors.dateOfBirth?.message} />
              <Input label="Phone Number" {...editForm.register('phoneNumber')} error={editForm.formState.errors.phoneNumber?.message} placeholder="+234 801 234 5678" />
              <Input label="Permanent Address" {...editForm.register('permanentAddress')} error={editForm.formState.errors.permanentAddress?.message} placeholder="123 Main Street" className="md:col-span-2" />
              <Input label="Residential Address" {...editForm.register('residentialAddress')} error={editForm.formState.errors.residentialAddress?.message} placeholder="456 Oak Avenue" className="md:col-span-2" />
              <Input label="Year of Graduation" {...editForm.register('graduationYear')} error={editForm.formState.errors.graduationYear?.message} placeholder="2020" />
              <Input label="Course of Study" {...editForm.register('courseOfStudy')} error={editForm.formState.errors.courseOfStudy?.message} placeholder="Computer Science" />
              <Select label="Unit/Ministry" {...editForm.register('unit')} error={editForm.formState.errors.unit?.message} options={[{ value: '', label: 'Select a unit' }, ...units.map(unit => ({ value: unit, label: unit }))]} />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button type="button" onClick={() => { setShowModal(false); setEditingMember(null); setIsEditMode(false); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Update Member'}
              </button>
            </div>
          </form>
        ) : (
          // Add Form - With password fields
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" {...addForm.register('fullName')} error={addForm.formState.errors.fullName?.message} placeholder="John Doe" />
              <Input label="Email Address" type="email" {...addForm.register('email')} error={addForm.formState.errors.email?.message} placeholder="john@example.com" />
              <Input label="Date of Birth" type="date" {...addForm.register('dateOfBirth')} error={addForm.formState.errors.dateOfBirth?.message} />
              <Input label="Phone Number" {...addForm.register('phoneNumber')} error={addForm.formState.errors.phoneNumber?.message} placeholder="+234 801 234 5678" />
              <Input label="Permanent Address" {...addForm.register('permanentAddress')} error={addForm.formState.errors.permanentAddress?.message} placeholder="123 Main Street" className="md:col-span-2" />
              <Input label="Residential Address" {...addForm.register('residentialAddress')} error={addForm.formState.errors.residentialAddress?.message} placeholder="456 Oak Avenue" className="md:col-span-2" />
              <Input label="Year of Graduation" {...addForm.register('graduationYear')} error={addForm.formState.errors.graduationYear?.message} placeholder="2020" />
              <Input label="Course of Study" {...addForm.register('courseOfStudy')} error={addForm.formState.errors.courseOfStudy?.message} placeholder="Computer Science" />
              <Select label="Unit/Ministry" {...addForm.register('unit')} error={addForm.formState.errors.unit?.message} options={[{ value: '', label: 'Select a unit' }, ...units.map(unit => ({ value: unit, label: unit }))]} />
              <Input label="Password" type="password" {...addForm.register('password')} error={addForm.formState.errors.password?.message} placeholder="••••••••" />
              <Input label="Confirm Password" type="password" {...addForm.register('confirmPassword')} error={addForm.formState.errors.confirmPassword?.message} placeholder="••••••••" />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button type="button" onClick={() => { setShowModal(false); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Add Member'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={!!viewingMember} onClose={() => setViewingMember(null)} title="Member Details" size="lg">
        {viewingMember && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-500">Full Name</label><p className="text-gray-900 mt-1">{viewingMember.fullName}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Email</label><p className="text-gray-900 mt-1">{viewingMember.email}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Phone Number</label><p className="text-gray-900 mt-1">{viewingMember.phoneNumber}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Date of Birth</label><p className="text-gray-900 mt-1">{formatDate(viewingMember.dateOfBirth)}</p></div>
              <div className="md:col-span-2"><label className="text-sm font-medium text-gray-500">Permanent Address</label><p className="text-gray-900 mt-1">{viewingMember.permanentAddress}</p></div>
              <div className="md:col-span-2"><label className="text-sm font-medium text-gray-500">Residential Address</label><p className="text-gray-900 mt-1">{viewingMember.residentialAddress}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Graduation Year</label><p className="text-gray-900 mt-1">{viewingMember.graduationYear}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Course of Study</label><p className="text-gray-900 mt-1">{viewingMember.courseOfStudy}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Unit/Ministry</label><p className="text-gray-900 mt-1">{viewingMember.unit}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Member Since</label><p className="text-gray-900 mt-1">{formatDate(viewingMember.createdAt)}</p></div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingMember(null)} className="btn-primary">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};