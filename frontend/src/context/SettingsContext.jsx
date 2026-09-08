import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../api/services/settingsService';

const DEFAULT_SETTINGS = {
  site_name: 'MURU',
  tagline: 'Simple skincare for your everyday glow.',
  telegram: 'muru_skincare',
  instagram: 'muru.official',
  facebook: 'muru.skincare',
  tiktok: 'muru_beauty',
  youtube: 'muru_skincare_official',
  phone: '+855 12 345 678',
  email: 'hello@muru.com',
  address: 'Phnom Penh, Cambodia',
  copyright: '© 2026 MURU. All rights reserved.',
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: true,
  updateSettings: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsService.getSettings();
        const payload = response.data?.data || response.data;
        if (payload) {
          setSettings(prev => ({ ...prev, ...payload }));
        }
      } catch (error) {
        console.error('Failed to fetch settings from API', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
