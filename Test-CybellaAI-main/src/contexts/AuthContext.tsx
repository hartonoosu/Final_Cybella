
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { AuthContextType, User } from "../types/authTypes";
import { useAuthActions } from "../hooks/useAuthActions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const {
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestEmailVerification
  } = useAuthActions(setUser, setIsAuthenticated);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id || "",
          fullName: currentUser.fullName || currentUser.name || "",
          email: currentUser.email || "",
          gender: currentUser.gender || "",
          dateOfBirth: currentUser.dateOfBirth || "",
          ageRange: currentUser.ageRange || "",
          aiName: currentUser.aiName || "",
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestEmailVerification,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
