import { useEffect } from 'react';

export const useAutoReload = (dependencies: any[] = []) => {
    useEffect(() => {
        // Store current timestamp
        const timestamp = Date.now();

        // Listen for visibility change to check for updates
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Page became visible, check for updates
                console.log('Page visible - checking for updates...');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, dependencies);
};