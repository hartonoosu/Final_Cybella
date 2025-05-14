import { toast } from "sonner";
import { User } from "../types/authTypes";
import { notificationStore } from "../components/header/NotificationBell";

export const handleLoginSuccess = (user: User): void => {
  notificationStore.addNotification({
    message: `Welcome back, ${user.name || user.email}!`, 
    type: 'success',
    read: false,
    userId: user.id // Associate notification with the user
  });
};

export const handleProfileUpdateSuccess = (userId: string, isSimulation: boolean): void => {
  if (isSimulation) {
    toast.success("Profile updated successfully (development mode)");
    notificationStore.addNotification({
      message: "Your profile was updated in development mode",
      type: 'info',
      read: false,
      userId: userId
    });
  } else {
    toast.success("Profile updated successfully");
    notificationStore.addNotification({
      message: "Your profile was updated successfully", 
      type: 'success',
      read: false,
      userId: userId
    });
  }
};

export const handlePasswordChangeSuccess = (userId: string, isSimulation: boolean): void => {
  if (isSimulation) {
    toast.success("Password changed successfully (development mode)");
    notificationStore.addNotification({
      message: "Your password was changed in development mode", 
      type: 'info',
      read: false,
      userId: userId
    });
  } else {
    toast.success("Password changed successfully");
    notificationStore.addNotification({
      message: "Your password was changed successfully", 
      type: 'success',
      read: false,
      userId: userId
    });
  }
};

export const handleEmailVerificationSuccess = (userId: string, isSimulation: boolean): void => {
  if (isSimulation) {
    toast.success("Verification email sent (development mode)");
    notificationStore.addNotification({
      message: "Simulated: Verification email would be sent in production mode", 
      type: 'info',
      read: false,
      userId: userId
    });
  } else {
    toast.success("Verification email sent");
    notificationStore.addNotification({
      message: "Verification email has been sent", 
      type: 'success',
      read: false,
      userId: userId
    });
  }
};

export const handleAuthError = (error: any, message: string): void => {
  toast.error(message);
  console.error(message, error);
};
