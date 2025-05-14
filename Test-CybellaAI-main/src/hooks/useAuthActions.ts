// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../services/auth";
// import { toast } from "sonner";
// import { 
//   handleLoginSuccess, 
//   handleProfileUpdateSuccess, 
//   handlePasswordChangeSuccess, 
//   handleEmailVerificationSuccess,
//   handleAuthError
// } from "../utils/authUtils";
// import { RegisterData, User } from "../types/authTypes";
// import { notificationStore } from "../components/header/NotificationBell";

// export const useAuthActions = (
//   setUser: React.Dispatch<React.SetStateAction<User | null>>,
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   const navigate = useNavigate();
  
//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const response = await authService.login({ email, password });
      
//       if (response.success && response.user) {
//         setUser(response.user);
//         setIsAuthenticated(true);
//         handleLoginSuccess(response.user);
//         return true;
//       } else {
//         toast.error(response.message || "Login failed");
//         return false;
//       }
//     } catch (error) {
//       handleAuthError(error, "An error occurred during login");
//       return false;
//     }
//   };

//   // const register = async (
//   //   fullName: string, 
//   //   email: string, 
//   //   password: string,
//   //   gender?: string,
//   //   dateOfBirth?: string,
//   //   ageRange?: string,
//   //   aiName?: string
//   // ): Promise<boolean> => {
//   //   try {
//   //     console.log("Registration started with:", { fullName, email, gender, dateOfBirth, ageRange, aiName });
      
//   //     const userData: RegisterData = { 
//   //       fullName, 
//   //       email, 
//   //       password,
//   //       gender,
//   //       dateOfBirth,
//   //       ageRange,
//   //       aiName
//   //     };
      
//   //     console.log("User data prepared:", userData);
//   //     const response = await authService.register(userData);
//   //     console.log("Registration response:", response);
      
//   //     if (response.success && response.user) {
//   //       toast.success("Registration successful! Please login.");
//   //       notificationStore.addNotification({
//   //         message: "Account created successfully! Please check your email for verification.",
//   //         type: 'success',
//   //         read: false,
//   //         userId: response.user.id
//   //       });
//   //       return true;
//   //     } else {
//   //       toast.error(response.message || "Registration failed");
//   //       return false;
//   //     }
//   //   } catch (error) {
//   //     console.error("Registration error:", error);
//   //     handleAuthError(error, "An error occurred during registration");
//   //     return false;
//   //   }
//   // };

//   const register = async (
//     fullName: string,
//     email: string,
//     password: string,
//     gender?: string,
//     dateOfBirth?: string,
//     ageRange?: string,
//     aiName?: string
//   ): Promise<boolean> => {
//     try {
//       console.log("Registration started with:", { fullName, email, gender, dateOfBirth, ageRange, aiName });
  
//       const userData: RegisterData = {
//         fullName,
//         email,
//         password,
//         gender,
//         dateOfBirth,
//         ageRange,
//         aiName,
//       };
  
//       const response = await authService.register(userData);
//       console.log("Registration response:", response);
  
//       // ✅ Accept success even if token is not returned
//       if (response.success && response.user) {
//         toast.success("Registration successful! Please login.");
//         notificationStore.addNotification({
//           message: "Account created successfully! Please check your email for verification.",
//           type: "success",
//           read: false,
//           userId: response.user.id,
//         });
//         return true;
//       } else {
//         toast.error(response.message || "Registration failed");
//         return false;
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       handleAuthError(error, "An error occurred during registration");
//       return false;
//     }
//   };
  

//   const logout = () => {
//     const user = authService.getCurrentUser();
//     authService.logout();
//     setUser(null);
//     setIsAuthenticated(false);
//     navigate("/login");
//     toast.success("Logged out successfully");
//   };

//   const updateProfile = async (updates: Partial<RegisterData>): Promise<boolean> => {
//     const user = authService.getCurrentUser();
//     if (!user) return false;
    
//     try {
//       const response = await authService.updateProfile(user.id, updates);
      
//       if (response.success && response.user) {
//         setUser(prevUser => ({ ...prevUser!, ...response.user }));
//         handleProfileUpdateSuccess(user.id, !!response.simulation);
//         return true;
//       } else if (response.simulation) {
//         setUser(prevUser => ({ 
//           ...prevUser!, 
//           name: updates.fullName || prevUser?.name,
//           gender: updates.gender || prevUser?.gender,
//           dateOfBirth: updates.dateOfBirth || prevUser?.dateOfBirth
//         }));
//         handleProfileUpdateSuccess(user.id, true);
//         return true;
//       } else {
//         toast.error(response.message || "Failed to update profile");
//         return false;
//       }
//     } catch (error) {
//       handleAuthError(error, "An error occurred while updating profile");
//       return false;
//     }
//   };

//   const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
//     const user = authService.getCurrentUser();
//     if (!user) return false;
    
//     try {
//       const response = await authService.changePassword(user.id, currentPassword, newPassword);
      
//       if (response.success) {
//         handlePasswordChangeSuccess(user.id, !!response.simulation);
//         return true;
//       } else {
//         toast.error(response.message || "Failed to change password");
//         return false;
//       }
//     } catch (error) {
//       handleAuthError(error, "An error occurred while changing password");
//       return false;
//     }
//   };

//   const requestEmailVerification = async (): Promise<boolean> => {
//     const user = authService.getCurrentUser();
//     if (!user) return false;
    
//     try {
//       const response = await authService.requestEmailVerification(user.email);
      
//       if (response.success) {
//         handleEmailVerificationSuccess(user.id, !!response.simulation);
//         return true;
//       } else {
//         toast.error(response.message || "Failed to send verification email");
//         return false;
//       }
//     } catch (error) {
//       handleAuthError(error, "An error occurred while requesting email verification");
//       return false;
//     }
//   };

//   return {
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     requestEmailVerification
//   };
// };


import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { toast } from "sonner";
import {
  handleLoginSuccess,
  handleProfileUpdateSuccess,
  handlePasswordChangeSuccess,
  handleEmailVerificationSuccess,
  handleAuthError,
} from "../utils/authUtils";
import { RegisterData, User } from "../types/authTypes";
import { notificationStore } from "../components/header/NotificationBell";

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        handleLoginSuccess(response.user);
        return true;
      } else {
        toast.error(response.message || "Login failed");
        return false;
      }
    } catch (error) {
      handleAuthError(error, "An error occurred during login");
      return false;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    gender?: string,
    dateOfBirth?: string,
    ageRange?: string,
    aiName?: string
  ): Promise<boolean> => {
    try {
      const userData: RegisterData = {
        fullName,
        email,
        password,
        gender,
        dateOfBirth,
        ageRange,
        aiName,
      };

      const response = await authService.register(userData);

      if (response.success && response.user) {
        toast.success("Registration successful! Please login.");
        notificationStore.addNotification({
          message: "Account created successfully! Please check your email for verification.",
          type: "success",
          read: false,
          userId: response.user.id,
        });
        return true;
      } else {
        toast.error(response.message || "Registration failed");
        return false;
      }
    } catch (error) {
      handleAuthError(error, "An error occurred during registration");
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const updateProfile = async (updates: Partial<RegisterData>): Promise<boolean> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return false;

    try {
      const response = await authService.updateProfile(currentUser.id, updates);

      if (response.success && response.user) {
        const updatedUser = { ...currentUser, ...response.user };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ Persist in localStorage
        handleProfileUpdateSuccess(currentUser.id, !!response.simulation);
        return true;
      } else {
        toast.error(response.message || "Failed to update profile");
        return false;
      }
    } catch (error) {
      handleAuthError(error, "An error occurred while updating profile");
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    try {
      const response = await authService.changePassword(
        user.id,
        currentPassword,
        newPassword
      );

      if (response.success) {
        handlePasswordChangeSuccess(user.id, !!response.simulation);
        return true;
      } else {
        toast.error(response.message || "Failed to change password");
        return false;
      }
    } catch (error) {
      handleAuthError(error, "An error occurred while changing password");
      return false;
    }
  };

  const requestEmailVerification = async (): Promise<boolean> => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    try {
      const response = await authService.requestEmailVerification(user.email);

      if (response.success) {
        handleEmailVerificationSuccess(user.id, !!response.simulation);
        return true;
      } else {
        toast.error(response.message || "Failed to send verification email");
        return false;
      }
    } catch (error) {
      handleAuthError(error, "An error occurred while requesting email verification");
      return false;
    }
  };

  return {
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestEmailVerification,
  };
};
