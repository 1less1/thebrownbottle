import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';

// Get Session Data
import { useSession } from '@/utils/SessionContext';

export default function TabLayout() {
  // Get session data
  const { sessionLoading, user } = useSession();

  // Prevent redirect flicker while session is restoring
  if (sessionLoading) {
    return null;
  }

  // Blocks access to ANY route under /(tabs) unless a user is signed in
  if (!user?.employee_id) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabTan,
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0.5,
          borderColor: Colors.altBorderColor,
          elevation: 5,
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks/index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size || 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar/index"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size || 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 28} color={color} />
          ),
        }}
      />

      {user?.admin === 1 ? (
        <Tabs.Screen
          name="admin/index"
          options={{
            title: 'Admin',
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
}
