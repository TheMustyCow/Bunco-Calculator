import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  hapticsEnabled: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const HAPTICS_KEY = 'haptics_enabled';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({
    hapticsEnabled: true,
  });

  useEffect(() => {
    // Load settings from storage
    const loadSettings = async () => {
      try {
        const storedHaptics = await AsyncStorage.getItem(HAPTICS_KEY);
        if (storedHaptics !== null) {
          setSettings(prev => ({
            ...prev,
            hapticsEnabled: JSON.parse(storedHaptics),
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Persist to storage
    if (newSettings.hapticsEnabled !== undefined) {
      try {
        await AsyncStorage.setItem(HAPTICS_KEY, JSON.stringify(newSettings.hapticsEnabled));
      } catch (error) {
        console.error('Failed to save haptics setting:', error);
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}