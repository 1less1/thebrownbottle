import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import Dashboard from "@/components/admin/Dashboard/Dashboard";
import Schedule from "@/components/admin/Schedule/Schedule";
import Staff from "@/components/admin/Staff/Staff";

import LoadingCircle from '@/components/modular/LoadingCircle';

// Get Session Data
import { useSession } from '@/utils/SessionContext';

const Admin = () => {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const { user } = useSession();
  const [activeTab, setActiveTab] = useState(0);
  const TAB_STORAGE_KEY = 'adminActiveTab';

  // Save tab index on change
  const handleTabChange = async (index: number) => {
    setActiveTab(index);
    await AsyncStorage.setItem(TAB_STORAGE_KEY, index.toString());
  };

  // Define available tabs and corresponding components
  const tabs = [
    {
      key: 'dashboard', title: 'Dashboard', component: user ? <Dashboard user={user} /> :
        <LoadingCircle
          size="large"
          style={{ marginTop: 40, alignSelf: 'center' }}
        />
    },

    { 
      key: 'schedule', title: 'Schedule', component: <Schedule /> 
    },

    {
      key: 'staff', title: 'Staff', component: <Staff />
    },
  ];

  // Load Saved Tab If it Exists, otherwise load tab index 0
  useEffect(() => {
    const loadSavedTab = async () => {
      try {
        const savedTabIndex = await AsyncStorage.getItem(TAB_STORAGE_KEY);
        const tabIndex = Number(savedTabIndex);
        if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < tabs.length) {
          setActiveTab(tabIndex);
        } else {
          setActiveTab(0);
        }
      } catch (error) {
        console.warn('Failed to load saved tab index:', error);
      }
    };
    loadSavedTab();
  }, []);

  return (

    <DefaultView backgroundColor={Colors.white}>

      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>

        <View style={{ backgroundColor: Colors.white }}>
          
          <Text style={GlobalStyles.pageHeader}>Admin</Text>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === index && styles.activeTabButton, // Style the active tab
                ]}
                onPress={() => handleTabChange(index)} // Set active tab on click
              >
                <Text style={styles.tabText}>{tab.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Render content based on selected tab */}
        <View style={styles.tabContent}>
          {tabs[activeTab]?.component} {/* Render the component of the active tab */}
        </View>

      </View>

    </DefaultView>

  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.altBorderColor,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: 16,
    color: 'black',
  },
  tabContent: {
    flex: 1,
  },
});

export default Admin;
