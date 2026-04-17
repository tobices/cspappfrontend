import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your email...');
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const hasVerified = useRef(false); // Prevent multiple verification attempts

    useEffect(() => {
        // Only run verification once
        if (hasVerified.current) return;
        hasVerified.current = true;

        const verifyEmail = async () => {
            const token = searchParams.get('token');

            console.log('=== Email Verification Debug ===');
            console.log('Token from URL:', token);

            if (!token) {
                setStatus('failed');
                setMessage('Invalid verification link. No token provided.');
                return;
            }

            try {
                // Direct fetch to backend
                const response = await fetch(`http://localhost:5000/api/v1/auth/verify-email/${token}`);
                const data = await response.json();

                console.log('Response status:', response.status);
                console.log('Response data:', data);

                // Check if verification was successful
                if (response.status === 200 && data.success === true) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now login.');
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login', { replace: true });
                    }, 3000);
                } else {
                    setStatus('failed');
                    setMessage(data.message || 'Verification failed');
                    if (data.email) setEmail(data.email);
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('failed');
                setMessage('Unable to connect to server. Please try again.');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    const handleResendVerification = async () => {
        let targetEmail = email;
        if (!targetEmail) {
            targetEmail = prompt('Please enter your email address:');
            if (!targetEmail) return;
        }

        setIsResending(true);
        try {
            const response = await fetch('http://localhost:5000/api/v1/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: targetEmail })
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Verification email resent! Please check your inbox.');
                // Reset verification state
                hasVerified.current = false;
                setStatus('verifying');
                setMessage('Verification email sent! Please check your inbox.');
            } else {
                toast.error(data.message || 'Failed to resend');
            }
        } catch (error) {
            toast.error('Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    // If status is success, show success page
    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gold-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Email Verified!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
                    <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    // If status is verifying, show loading
    if (status === 'verifying') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gold-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                    <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying Your Email</h2>
                    <p className="text-gray-600 dark:text-gray-400">{message}</p>
                </div>
            </div>
        );
    }

    // If status is failed, show failed page
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gold-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Verification Failed</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

                <div className="space-y-3">
                    <button
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="w-full btn-primary"
                    >
                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                    </button>

                    <Link to="/login" className="block w-full btn-secondary text-center">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};