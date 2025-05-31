import React, { useState, useEffect } from 'react';
import { AnimatedAlert } from './animated-alert';
import { createPortal } from 'react-dom';

export interface AlertItem {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface AnimatedAlertContainerProps {
  alerts: AlertItem[];
  onAlertClose: (id: number) => void;
}

export function AnimatedAlertContainer({ alerts, onAlertClose }: AnimatedAlertContainerProps) {
  // Create a portal for the alerts to be shown at the top level of the DOM
  return createPortal(
    <div className="fixed top-0 right-0 z-[100] flex flex-col gap-2 p-4 max-w-sm">
      {alerts.map((alert, index) => (
        <AnimatedAlert
          key={alert.id}
          style={{ top: `${(index * 5) + 1}rem` }}
          variant={alert.type}
          message={alert.message}
          duration={alert.duration || 8000}
          onClose={() => onAlertClose(alert.id)}
          autoClose={true}
        />
      ))}
    </div>,
    document.body
  );
}

// Create a singleton alert store
export const alertStore = {
  alerts: [] as AlertItem[],
  listeners: [] as ((alerts: AlertItem[]) => void)[],
  
  addAlert(alert: Omit<AlertItem, 'id'>) {
    const newAlert = {
      ...alert,
      id: Date.now(),
    };
    
    this.alerts.push(newAlert);
    this.notifyListeners();
    
    return newAlert.id;
  },
  
  removeAlert(id: number) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.notifyListeners();
  },
  
  subscribe(listener: (alerts: AlertItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  
  notifyListeners() {
    this.listeners.forEach(listener => listener([...this.alerts]));
  }
};

// Helper function to add alerts that can be called from anywhere
export const showAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration = 8000) => {
  return alertStore.addAlert({ message, type, duration });
};

export function AlertProvider() {
  const [alertList, setAlertList] = useState<AlertItem[]>([]);

  useEffect(() => {
    const unsubscribe = alertStore.subscribe((alerts) => {
      setAlertList(alerts);
    });
    
    return unsubscribe;
  }, []);

  const handleCloseAlert = (id: number) => {
    alertStore.removeAlert(id);
  };

  return <AnimatedAlertContainer alerts={alertList} onAlertClose={handleCloseAlert} />;
}