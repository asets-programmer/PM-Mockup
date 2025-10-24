import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Ambil bahasa dari localStorage atau default ke 'ENG'
    return localStorage.getItem('stori_language') || 'ENG';
  });

  // Simpan ke localStorage setiap kali bahasa berubah
  useEffect(() => {
    localStorage.setItem('stori_language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    changeLanguage,
    isEnglish: language === 'ENG',
    isIndonesian: language === 'ID'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
