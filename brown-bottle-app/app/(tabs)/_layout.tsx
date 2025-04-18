import { Tabs, useLocalSearchParams} from 'expo-router';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {

  const { isAdmin } = useLocalSearchParams();
  const isAdminBoolean = String(isAdmin).toLowerCase() === 'true';
  console.log(isAdmin);

  return (
    // New Navbar Theme!
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.darkBrown,
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: 'white', // Static background color -> White
          borderTopWidth: 0.5,
          borderColor: Colors.borderColor, // Border color
          elevation: 5, // Shadow for Android
          shadowOpacity: 0.1, // Shadow for iOS
          shadowRadius: 3,
        },
      }}>


      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />backgroundColor: 'rgba(255, 255, 255, 0.7)', 

      <Tabs.Screen
        name="tasks/index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tray.2" color={color} />,
        }}
      />

      <Tabs.Screen
        name="calendar/index"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />

      <Tabs.Screen
        name="chat/index"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.left.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />

      {/* Completely exclude the Admin tab if isAdminBoolean is false */}
      {isAdminBoolean? (
        <Tabs.Screen
          name="admin/index"
          options={{
            title: "Admin",
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.fill" color={color} />,
          }}
        />

        ) : (

        <Tabs.Screen
          name="admin/index"
          options={{
            title: "You Should Not Be Seeing This",
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.fill" color={color} />,
            href: null,
          }} 
        />

      )}
      
    </Tabs>

  );

}