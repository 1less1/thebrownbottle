import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'; // <-- Added Platform
import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';

import Dashboard from "@/components/admin/Dashboard/Dashboard";
import Requests from '@/components/admin/Requests/Requests';
import Schedule from "@/components/admin/Schedule/Schedule";
import Staff from "@/components/admin/Staff/Staff";

import { useSession } from '@/utils/SessionContext';

import Sidebar from "@/components/admin/Sidebar";

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
      key: 'dashboard', title: 'Dashboard', component: <Dashboard />
    },
    {
      key: 'requuests', title: 'Requests', component: <Requests />
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

      {/* Added: flexDirection row only on web to support sidebar */}
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bgApp,
          flexDirection: Platform.OS === "web" ? "row" : "column",
        }}
      >

        {/* Main Content FIRST (Left side) */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderBottomWidth: Platform.OS === "web" ? 1 : 0, // add border if web
              borderBottomColor: Platform.OS === "web" ? Colors.borderColor : "transparent",
            }}
          >

            <Text style={GlobalStyles.pageHeader}>Admin</Text>

            {/* Tab Bar (Mobile Only) */}
            {Platform.OS !== "web" && (
              <View style={styles.tabBar}>
                {tabs.map((tab, index) => (
                  <TouchableOpacity
                    key={tab.key}
                    style={[
                      styles.tabButton,
                      activeTab === index && styles.activeTabButton,
                    ]}
                    onPress={() => handleTabChange(index)}
                  >
                    <Text style={styles.tabText}>{tab.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {tabs[activeTab]?.component}
          </View>
        </View>

        {/* Sidebar (Right side) */}
        {Platform.OS === "web" && (
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} tabs={tabs} />
        )}

      </View>


    </DefaultView>

  );
};

export default Admin;

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
