'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConfig } from './ConfigContext';

type Language = 'en' | 'es' | 'fr' | 'de';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: any) => string;
}

const LocalizationContext = createContext<LocalizationContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  const { config } = useConfig();
  const [language, setLanguage] = useState<Language>('en');

  // Translation helper
  // It checks if 'key' is a string or an object with language keys
  const t = (key: any): string => {
    if (typeof key === 'string') return key;
    if (typeof key === 'object' && key !== null) {
      return key[language] || key['en'] || Object.values(key)[0] as string || '';
    }
    return String(key || '');
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useTranslation = () => useContext(LocalizationContext);
