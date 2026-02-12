import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { Employee } from '@/types/iEmployee';
import { registerForPushNotificationsAsync, savePushTokenToStorageAsync } from './notification';

export type User = Partial<Employee>;

type SessionContextType = {
  user: User | null;
  sessionLoading: boolean;
  setUser: (user: User | null) => Promise<void>;
  clearSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  sessionLoading: true,
  // setUser(): Persists the user session and updates state
  setUser: async () => {},
  // clearSession(): Clears persisted session and resets state
  clearSession: async () => {},
});

const USER_KEY = 'user_session';

// getUserFromStorage(): Reads the saved user session from the correct storage for the current platform
const getUserFromStorage = async (): Promise<User | null> => {
  if (Platform.OS === 'web') {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } else {
    const storedUser = await SecureStore.getItemAsync(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }
};

// saveUserToStorage(): Writes (or removes) the user session in the correct storage for the current platform
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

// clearSessionStorage(): Removes the saved user session from the correct storage for the current platform
const clearSessionStorage = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // loadUser(): Restores a previously saved session on app start
    const loadUser = async () => {
      try {
        const storedUser = await getUserFromStorage();
        if (storedUser) {
          setUserState(storedUser);
        }
      } catch (e) {
        console.error('Error loading user from storage:', e);
      } finally {
        // Marks session hydration complete (prevents redirect flicker)
        setSessionLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    // setupPushNotifications(): Registers for push + posts the token to backend when a user is present
    const setupPushNotifications = async () => {
      // Skip web entirely (prevents unnecessary work + console noise)
      if (Platform.OS === 'web') return;

      // Only register when we have an employee id
      const employeeId = user?.employee_id;
      if (!employeeId) return;

      // Guard missing env var so we don't fetch "undefined/..."
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
        console.warn('Missing EXPO_PUBLIC_API_URL. Skipping push token registration.');
        return;
      }

      try {
        // registerForPushNotificationsAsync(): Requests permission and returns an Expo push token (or null)
        const expoPushToken = await registerForPushNotificationsAsync();

        // If token was not created (permission denied / simulator / unsupported), stop
        if (!expoPushToken) return;

        // savePushTokenToStorageAsync(): Persists token locally so logout can unregister it
        await savePushTokenToStorageAsync(expoPushToken);

        const res = await fetch(`${apiUrl}/push-token/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: employeeId,
            expo_push_token: expoPushToken,
          }),
        });

        // If backend rejects token, warn but don’t crash app
        if (!res.ok) {
          console.warn(`Push token registration failed (${res.status}).`);
        }
      } catch (err) {
        console.error('Push notification setup failed:', err);
      }
    };

    setupPushNotifications();
    // Only rerun when employee id changes (prevents duplicate registrations)
  }, [user?.employee_id]);

  // setUser(): Persists user session then updates state
  const setUser = async (newUser: User | null) => {
    try {
      await saveUserToStorage(newUser);
      setUserState(newUser);
    } catch (e) {
      console.error('Error saving user to storage:', e);
    }
  };

  // clearSession(): Clears persisted session and resets state
  const clearSession = async () => {
    try {
      await clearSessionStorage();
      setUserState(null);
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  };

  return (
    <SessionContext.Provider value={{ user, sessionLoading, setUser, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// useSession(): Convenience hook to access session context values
export const useSession = () => useContext(SessionContext);
