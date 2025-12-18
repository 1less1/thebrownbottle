// Session Functions

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { Employee } from '@/types/iEmployee';

import { registerForPushNotificationsAsync } from './notification';

export type User = Employee;

type SessionContextType = {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  clearSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  setUser: async () => { },
  clearSession: async () => { },
});

const USER_KEY = 'user_session';

// Helper: Get user from storage
const getUserFromStorage = async (): Promise<User | null> => {
  if (Platform.OS === 'web') {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } else {
    const storedUser = await SecureStore.getItemAsync(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }
};

// Helper: Save user to storage
const saveUserToStorage = async (user: User | null) => {
  const serialized = user ? JSON.stringify(user) : null;

  if (Platform.OS === 'web') {
    if (serialized) {
      localStorage.setItem(USER_KEY, serialized);
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } else {
    if (serialized) {
      await SecureStore.setItemAsync(USER_KEY, serialized);
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  }
};

// Helper: Clear session storage
const clearSessionStorage = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getUserFromStorage();
        if (storedUser) {
          setUserState(storedUser);
        }
      } catch (e) {
        console.error('Error loading user from storage:', e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const setupPushNotifications = async () => {
      try {
        // Request permission + get Expo push token
        const expoPushToken =
          await registerForPushNotificationsAsync();

        // Exit if token was not created (denied or unsupported device)
        if (!expoPushToken) return;

        const apiUrl = process.env.EXPO_PUBLIC_API_URL;

        console.log("Attempting fetch to:", `${apiUrl}/push-token/register`); // Debug log
        await fetch(`${apiUrl}/push-token/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.employee_id,
            expo_push_token: expoPushToken,
          }),
        }).catch(err => {
          console.error("Network Error Details:", err.message);
          // This will confirm if it's a timeout or a rejected connection
        });

      } catch (err) {
        console.error('Push notification setup failed:', err);
      }
    };

    setupPushNotifications();
  }, [user]);


  const setUser = async (newUser: User | null) => {
    try {
      await saveUserToStorage(newUser);
      setUserState(newUser);
    } catch (e) {
      console.error('Error saving user to storage:', e);
    }
  };

  const clearSession = async () => {
    try {
      await clearSessionStorage();
      setUserState(null);
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  };

  return (
    <SessionContext.Provider value={{ user, setUser, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
