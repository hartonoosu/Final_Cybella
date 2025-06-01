
import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectivityWarningProps {
  onNetworkIssue?: (hasIssue: boolean) => void;
}

const ConnectivityWarning: React.FC<ConnectivityWarningProps> = ({ onNetworkIssue }) => {
  const { isOnline, connectionQuality, hasBuffering, hasSignificantConnectionIssue } = useNetworkStatus();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  
  // Only show warning for significant issues and when not dismissed
  useEffect(() => {
    if (hasSignificantConnectionIssue && !dismissed) {
      // Add longer delay before showing to prevent flickering
      const timer = setTimeout(() => {
        setVisible(true);
        if (onNetworkIssue) onNetworkIssue(true);
      }, 3000); // 3 second delay to filter temporary issues
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      if (onNetworkIssue) onNetworkIssue(false);
    }
  }, [hasSignificantConnectionIssue, dismissed, onNetworkIssue]);
  
  // Reset when connection is fully restored
  useEffect(() => {
    if (isOnline && connectionQuality === 'good' && !hasBuffering) {
      setDismissed(false);
    }
  }, [isOnline, connectionQuality, hasBuffering]);
  
  if (!visible) return null;
  
  return (
    <Alert 
      variant="warning" 
      className="fixed top-4 right-4 max-w-md z-50 bg-white dark:bg-gray-900 shadow-lg animate-in fade-in duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Network Connection Issue</AlertTitle>
          <AlertDescription>
            {!isOnline ? (
              "Your device appears to be offline. Please check your internet connection."
            ) : connectionQuality === 'poor' ? (
              "Your connection seems unstable. This may affect video quality and facial recognition."
            ) : (
              "Connection buffering detected. For the best experience, try moving to an area with better signal."
            )}
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 mt-1" 
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

export default ConnectivityWarning;
