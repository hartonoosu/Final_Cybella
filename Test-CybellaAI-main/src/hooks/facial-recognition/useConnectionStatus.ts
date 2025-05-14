import { useState, useEffect, useCallback, useRef } from 'react';

interface ConnectionStatusOptions {
  externalConnectionIssue?: boolean;
  checkConnectionQuality?: boolean;
  pollingInterval?: number;
}

export function useConnectionStatus(options: ConnectionStatusOptions = {}) {
  const { 
    externalConnectionIssue,
    checkConnectionQuality: shouldCheckConnectionQuality = true,
    pollingInterval = 15000 // Increased polling interval (15s)
  } = options;
  
  const [connectionIssue, setConnectionIssue] = useState<boolean>(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor'>('good');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const consecutiveFailuresRef = useRef<number>(0);
  const MIN_CONSECUTIVE_FAILURES = 2; // Require multiple failures
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      consecutiveFailuresRef.current = 0;
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check connection quality using image load timing
  const checkConnectionQuality = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      setConnectionQuality('poor');
      return;
    }
    
    try {
      const startTime = Date.now();
      
      // Create a simple image element to test connection speed
      const img = new Image();
      let isLoaded = false;
      let hasTimedOut = false;
      
      // Set a timeout to detect slow connections
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => {
          hasTimedOut = true;
          reject(new Error("Connection test timed out"));
        }, 8000);
      });
      
      // Create a promise to check if the image loads
      const loadPromise = new Promise<void>((resolve) => {
        img.onload = () => {
          isLoaded = true;
          resolve();
        };
        img.onerror = () => {
          // Even if error occurs, we got a network response
          isLoaded = true;
          resolve();
        };
        // Use a data URI to avoid any network requests
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      });
      
      // Race between timeout and image load
      await Promise.race([loadPromise, timeoutPromise]);
      
      const responseTime = Date.now() - startTime;
      
      // Use higher threshold to avoid false positives
      if (hasTimedOut || responseTime > 3000) {
        consecutiveFailuresRef.current++;
        if (consecutiveFailuresRef.current >= MIN_CONSECUTIVE_FAILURES) {
          setConnectionQuality('poor');
        }
      } else {
        setConnectionQuality('good');
        consecutiveFailuresRef.current = 0;
      }
    } catch (error) {
      // Only set to poor if it's multiple consecutive errors
      consecutiveFailuresRef.current++;
      if (consecutiveFailuresRef.current >= MIN_CONSECUTIVE_FAILURES) {
        setConnectionQuality('poor');
      }
    }
  }, []);
  
  // Periodically check connection quality if enabled
  useEffect(() => {
    if (!shouldCheckConnectionQuality) return;
    
    checkConnectionQuality();
    const interval = setInterval(() => {
      checkConnectionQuality();
    }, pollingInterval);
    
    return () => clearInterval(interval);
  }, [shouldCheckConnectionQuality, pollingInterval, checkConnectionQuality]);
  
  // Calculate overall connection issue state
  useEffect(() => {
    // Only consider it an issue if there's a persistent problem
    const hasIssue = (!isOnline || 
                     (connectionQuality === 'poor' && consecutiveFailuresRef.current >= MIN_CONSECUTIVE_FAILURES) || 
                     !!externalConnectionIssue);
    
    // Add a larger delay before setting connection issue to prevent flickering
    const timer = setTimeout(() => {
      setConnectionIssue(hasIssue);
    }, 2000); // 2s delay
    
    return () => clearTimeout(timer);
  }, [isOnline, connectionQuality, externalConnectionIssue]);
  
  return { 
    connectionIssue, 
    isOnline, 
    connectionQuality
  };
}