import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import Dashboard from "@/components/admin/Dashboard";
import Schedule from "@/components/admin/Schedule";
import Staff from "@/components/admin/Staff";

export default function Admin() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const [activeTab, setActiveTab] = useState(0); // Track active tab index
  const tabs = [
    { key: "dashboard", title: "Dash" },
    { key: "schedule", title: "Schedule" },
    { key: "staff", title: "Staff" },
  ];

  // Function to render the content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Dashboard />;
      case 1:
        return <Schedule />;
      case 2:
        return <Staff />;
      default:
        return null;
    }
  };

  return (
    
    <DefaultView>


      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>


        <View style={{ flex: 1, paddingTop: 15, backgroundColor: "white" }}>
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

          {/* Render content based on selected tab */}
          <View style={styles.tabContent}>{renderTabContent()}</View>

        </View>

      </View>
      

    </DefaultView>

    
    
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    marginLeft: 20,
    marginTop: 40,
    marginBottom:20,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderBottomColor: "black", 
  },
  tabText: {
    fontSize: 14,
    color: "black",
  },
  tabContent: {
    flex: 1,
  },
});

