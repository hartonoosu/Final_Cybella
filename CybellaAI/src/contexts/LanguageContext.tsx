
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  t: (key: string, section?: string, vars?: Record<string, any>) => string;
}

const defaultContext: LanguageContextType = {
  language: 'en',
  // Simple function that just returns the key (no translation)
  t: (key) => key
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LanguageContext.Provider value={defaultContext}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
