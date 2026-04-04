import React, { useEffect, useState } from 'react';

export const DevHelper: React.FC = () => {
    const [hmrStatus, setHmrStatus] = useState('active');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        // Listen for HMR updates
        if (import.meta.hot) {
            import.meta.hot.on('vite:beforeUpdate', () => {
                setHmrStatus('updating...');
            });

            import.meta.hot.on('vite:afterUpdate', () => {
                setHmrStatus('updated');
                setLastUpdate(new Date());
                setTimeout(() => setHmrStatus('active'), 2000);
            });

            import.meta.hot.on('vite:error', (error) => {
                console.error('HMR Error:', error);
                setHmrStatus('error');
            });
        }
    }, []);

    // Only show in development
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-mono shadow-lg">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${hmrStatus === 'active' ? 'bg-green-500 animate-pulse' :
                    hmrStatus === 'updating...' ? 'bg-yellow-500' :
                        hmrStatus === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
            HMR: {hmrStatus}
            {lastUpdate && hmrStatus === 'updated' && (
                <span className="ml-2 text-green-400">
                    {lastUpdate.toLocaleTimeString()}
                </span>
            )}
        </div>
    );
};