import { CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { donationAPI } from '../services/api';

export const DonationCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get('reference');
            const pendingReference = localStorage.getItem('pendingDonation');

            if (!reference && !pendingReference) {
                setStatus('failed');
                setMessage('No payment reference found');
                return;
            }

            try {
                const refToVerify = reference || pendingReference;
                const response = await donationAPI.verify(refToVerify!);

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Payment verified successfully! Thank you for your donation.');
                    localStorage.removeItem('pendingDonation');

                    // Redirect to donation history after 3 seconds
                    setTimeout(() => {
                        navigate('/donation-history');
                    }, 3000);
                } else {
                    setStatus('failed');
                    setMessage('Payment verification failed. Please contact support.');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('failed');
                setMessage('An error occurred while verifying your payment.');
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
                            <LoadingSpinner />
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
                            <button
                                onClick={() => navigate('/donate')}
                                className="mt-6 btn-primary"
                            >
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};