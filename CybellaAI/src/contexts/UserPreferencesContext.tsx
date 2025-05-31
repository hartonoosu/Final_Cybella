
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserPreferences {
  hobbies: string[];
  favoritePlaces: string[];
  favoriteGames: string[];
  bestFriends: string[];
  favoriteFood: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  addPreference: <K extends keyof UserPreferences>(
    key: K,
    value: string
  ) => void;
}

const defaultPreferences: UserPreferences = {
  hobbies: [],
  favoritePlaces: [],
  favoriteGames: [],
  bestFriends: [],
  favoriteFood: []
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load from localStorage if available
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addPreference = <K extends keyof UserPreferences>(
    key: K,
    value: string
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: Array.isArray(prev[key]) ? [...prev[key], value] : [value]
    }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreference, addPreference }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
