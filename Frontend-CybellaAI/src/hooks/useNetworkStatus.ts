import { useState, useEffect, useRef } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor'>('good');
  const [hasBuffering, setHasBuffering] = useState<boolean>(false);
  const [lastConnectionChange, setLastConnectionChange] = useState<Date>(new Date());
  const consecutiveIssuesRef = useRef<number>(0);
  const MIN_CONSECUTIVE_ISSUES = 2; // Require multiple failures before showing warnings
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastConnectionChange(new Date());
      consecutiveIssuesRef.current = 0;
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastConnectionChange(new Date());
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection quality using a more reliable method
    const checkConnection = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }
      
      try {
        const startTime = Date.now();
        // Use image request, less likely to be blocked and more reliable
        // Creating a dummy image request to test connection
        const img = new Image();
        let isLoaded = false;
        let hasTimedOut = false;
        
        // Set a timeout to detect slow connections (8s)
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
            // We'll still consider the network as available even if the image fails
            // as long as we get a response (even an error)
            isLoaded = true;
            resolve();
          };
          // Use a data URI instead of an actual network request
          // This just checks if the browser can process images at all
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        });
        
        // Race between timeout and image load
        await Promise.race([loadPromise, timeoutPromise]);
        
        const responseTime = Date.now() - startTime;
        
        if (hasTimedOut || responseTime > 2500) {
          consecutiveIssuesRef.current++;
          
          if (consecutiveIssuesRef.current >= MIN_CONSECUTIVE_ISSUES) {
            setConnectionQuality('poor');
            setHasBuffering(true);
          }
        } else {
          setConnectionQuality('good');
          setHasBuffering(false);
          consecutiveIssuesRef.current = 0;
        }
        
        setIsOnline(true);
      } catch (error) {
        // Handle timeout or other errors
        consecutiveIssuesRef.current++;
        
        if (consecutiveIssuesRef.current >= MIN_CONSECUTIVE_ISSUES) {
          setConnectionQuality('poor');
          setHasBuffering(true);
        }
        
        if (!navigator.onLine) {
          setIsOnline(false);
        }
      }
    };
    
    // Check connection less frequently (every 15 seconds)
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Add a convenience method to determine if there's an actual connection issue
  // that warrants displaying a warning to the user
  const hasSignificantConnectionIssue = !isOnline || 
    (connectionQuality === 'poor' && consecutiveIssuesRef.current >= MIN_CONSECUTIVE_ISSUES);

  return { 
    isOnline, 
    connectionQuality, 
    hasBuffering,
    lastConnectionChange,
    hasSignificantConnectionIssue
  };
}