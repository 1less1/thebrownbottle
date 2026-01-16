import { Tabs, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';

import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '@/constants/GlobalStyles';

import { Colors } from '@/constants/Colors';

import { IconSymbol } from '@/components/ui/IconSymbol';

// Get Session Data
import { useSession } from '@/utils/SessionContext';

export default function TabLayout() {

  // Get session data
  const { setUser, user } = useSession();

  return (
    // New Navbar Theme!
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabTan,
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: 'white', // Static background color -> White
          borderTopWidth: 0.5,
          borderColor: Colors.altBorderColor, // Border color
          elevation: 5, // Shadow for Android
          shadowOpacity: 0.1, // Shadow for iOS
          shadowRadius: 3,
        },
      }}>


      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks/index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size || 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar/index"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size || 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 28} color={color} />
          ),
        }}
      />

      {user?.admin === 1 ? (
        <Tabs.Screen
          name="admin/index"
          options={{
            title: "Admin",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="shield-checkmark" size={size || 28} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="admin/index"
          options={{
            href: null,
          }}
        />
      )}
    </Tabs>

  );
};