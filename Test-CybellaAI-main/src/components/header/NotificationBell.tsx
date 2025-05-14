import React, { useState, useEffect } from 'react';
import { Bell, BellDot } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

// Notification type definition
export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  userId?: string; // Add userId to track which user owns this notification
}

// Create a global notification store
export const notificationStore = {
  notifications: [] as Notification[],
  listeners: [] as ((notifications: Notification[]) => void)[],
  
  addNotification(notification: Omit<Notification, 'id' | 'time'>) {
    const newNotification = {
      ...notification,
      id: Date.now(),
      time: 'Just now',
    };
    
    this.notifications.unshift(newNotification);
    
    // Keep only the latest 10 notifications per user
    this.notifications = this.notifications.slice(0, 50); // Keep more total but filter by user when displaying
    
    this.notifyListeners();
    return newNotification;
  },
  
  markAllAsRead(userId: string | undefined) {
    this.notifications = this.notifications.map(notification => 
      notification.userId === userId ? { ...notification, read: true } : notification
    );
    this.notifyListeners();
  },
  
  clearNotifications(userId: string | undefined) {
    // Only clear notifications for the current user
    this.notifications = this.notifications.filter(notification => notification.userId !== userId);
    this.notifyListeners();
  },
  
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  
  notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
};

// Helper function to add notifications that can be called from anywhere
export const addNotification = (notification: Omit<Notification, 'id' | 'time'>) => {
  return notificationStore.addNotification(notification);
};

const NotificationBell = () => {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = notificationStore.subscribe(notifications => {
      // Filter notifications for the current user only
      const userNotifications = notifications.filter(notification => 
        notification.userId === user?.id
      );
      setLocalNotifications(userNotifications);
      setHasUnread(userNotifications.some(notification => !notification.read));
    });
    
    // Add welcome notification if user is logged in
    if (user) {
      const welcomeNotification = {
        message: `Welcome back, ${user.name || user.email}!`,
        type: 'info' as const,
        read: false,
        userId: user.id // Associate notification with user
      };
      notificationStore.addNotification(welcomeNotification);
    }
    
    return unsubscribe;
  }, [user]);
  
  const handleOpenChange = (open: boolean) => {
    // Mark all as read when dropdown opens
    if (open && hasUnread) {
      notificationStore.markAllAsRead(user?.id);
    }
  };

  const clearNotifications = () => {
    notificationStore.clearNotifications(user?.id);
  };

  // Get the appropriate notification icon class based on type
  const getNotificationTypeClass = (type?: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-l-4 border-green-500';
      case 'warning': return 'bg-amber-50 border-l-4 border-amber-500';
      case 'error': return 'bg-red-50 border-l-4 border-red-500';
      default: return 'bg-blue-50 border-l-4 border-blue-500';
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 relative h-9 w-9 transition-all duration-300"
        >
          {hasUnread ? (
            <BellDot size={20} className="animate-pulse" />
          ) : (
            <Bell size={20} />
          )}
          {hasUnread && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-glow animate-ping-slow"></span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0 overflow-hidden rounded-xl border border-gray-200 shadow-lg animate-in fade-in-50 slide-in-from-top-5 duration-200">
        <div className="flex justify-between items-center py-3 px-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <h3 className="font-medium text-gray-800">Notifications</h3>
          {localNotifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearNotifications} 
              className="text-xs hover:bg-gray-100 h-7 px-2 text-gray-600"
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="max-h-[280px] overflow-y-auto">
          {localNotifications.length > 0 ? (
            localNotifications.map(notification => (
              <DropdownMenuItem key={notification.id} className={cn(
                "p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 focus:bg-gray-50 focus:text-inherit",
                notification.read ? "opacity-80" : "font-medium",
                getNotificationTypeClass(notification.type)
              )}>
                <div className="w-full">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-gray-500 bg-gray-50/50">
              No notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;