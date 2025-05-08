import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wage: string;
  is_admin: number;
  primary_role: number;
  secondary_role: number;
  tertiary_role: number;
};

type SessionContextType = {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  clearSession: () => Promise<void>;  // Add clearSession function type
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  setUser: async () => {},
  clearSession: async () => {}  // Default empty function
});

const USER_KEY = 'user_session';

// Helper function to get from storage
const getUserFromStorage = async () => {
  if (Platform.OS === 'web') {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } else {
    return await SecureStore.getItemAsync(USER_KEY).then((storedUser) =>
      storedUser ? JSON.parse(storedUser) : null
    );
  }
};

// Helper function to save to storage
const saveUserToStorage = async (user: User | null) => {
  if (Platform.OS === 'web') {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } else {
    if (user) {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  }
};

// Clear the session
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
        console.error("Error loading user from storage:", e);
      }
    };
    loadUser();
  }, []);

  const setUser = async (newUser: User | null) => {
    try {
      await saveUserToStorage(newUser);
      setUserState(newUser);
    } catch (e) {
      console.error("Error saving user to storage:", e);
    }
  };

  const clearSession = async () => {
    try {
      await clearSessionStorage();
      setUserState(null); // Clear the user state as well
    } catch (e) {
      console.error("Error clearing session:", e);
    }
  };

  return (
    <SessionContext.Provider value={{ user, setUser, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
