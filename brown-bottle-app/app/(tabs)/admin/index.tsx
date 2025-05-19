import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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

  // Define available tabs and corresponding components
  const tabs = [
    { key: 'dashboard', title: 'Dashboard', component: user ? <Dashboard user={user} /> : 
    <LoadingCircle
      size="large"
      style={{ marginTop: 40, alignSelf: 'center' }}
    /> },

    { key: 'schedule', title: 'Schedule', component: <Schedule/> },

    { key: 'staff', title: 'Staff', component: <Staff/> },
  ];

  return (

    <DefaultView>
      
      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>
        
        <View style={{backgroundColor: Colors.white }}>
          <Text style={styles.header}>Admin</Text>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === index && styles.activeTabButton, // Style the active tab
                ]}
                onPress={() => setActiveTab(index)} // Set active tab on click
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
    marginTop: 40,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
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
