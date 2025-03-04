// src/lang/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';
import translations from './translations';

// ایجاد Context برای زبان
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('fa'); // زبان پیش‌فرض فارسی

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// هوک برای استفاده راحت از Context
export const useLanguage = () => useContext(LanguageContext);