import { CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { donationAPI } from '../services/api';

export const DonationCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            console.log('=== Donation Callback Page Loaded ===');
            console.log('Full URL:', window.location.href);
            console.log('Search params:', Object.fromEntries(searchParams));

            // Get reference from URL params
            const reference = searchParams.get('reference');
            const trxref = searchParams.get('trxref');
            const paymentReference = reference || trxref;

            console.log('Payment Reference:', paymentReference);

            if (!paymentReference) {
                setStatus('failed');
                setMessage('No payment reference found. Please contact support.');
                return;
            }

            try {
                // Get token from localStorage
                const token = localStorage.getItem('token');
                console.log('Has token:', !!token);

                if (!token) {
                    setStatus('failed');
                    setMessage('You need to be logged in to verify payment.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                    return;
                }

                // Call backend to verify payment
                const response = await donationAPI.verify(paymentReference);
                console.log('Verification response:', response.data);

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Payment verified successfully! Thank you for your donation.');

                    // Clear pending donation
                    localStorage.removeItem('pendingDonation');

                    // Redirect to donation history after 3 seconds
                    setTimeout(() => {
                        navigate('/donation-history');
                    }, 3000);
                } else {
                    setStatus('failed');
                    setMessage(response.data.message || 'Payment verification failed. Please contact support.');
                }
            } catch (error: any) {
                console.error('Verification error:', error);
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);

                // Check if it's a 401/403 error (unauthorized)
                if (error.response?.status === 401 || error.response?.status === 403) {
                    setMessage('Your session has expired. Please login again.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else if (error.response?.status === 404) {
                    setMessage('Payment verification endpoint not found. Please contact support.');
                } else {
                    setMessage(error.response?.data?.message || 'An error occurred while verifying your payment.');
                }
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full mx-4">
                <div className="card p-8 text-center">
                    {status === 'verifying' && (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                                Verifying Payment
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="mt-4 text-xl font-semibold text-green-600 dark:text-green-400">
                                Payment Successful!
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
                            <p className="mt-4 text-sm text-gray-500">Redirecting to donation history...</p>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h2 className="mt-4 text-xl font-semibold text-red-600 dark:text-red-400">
                                Verification Failed
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => navigate('/donate')}
                                    className="w-full btn-primary"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => navigate('/donation-history')}
                                    className="w-full btn-secondary"
                                >
                                    View Donation History
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};