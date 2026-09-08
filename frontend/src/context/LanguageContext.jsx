import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { languages } from '../i18n';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('muru-language');
    return saved || 'km';
  });

  useEffect(() => {
    localStorage.setItem('muru-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (languages[lang]) {
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let value = languages[language];
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key;
        }
      }
      return value || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
