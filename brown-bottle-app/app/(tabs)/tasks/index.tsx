import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import TaskList from '@/components/tasks/features/TaskList';
import Active from '@/components/tasks/Active';
import Upcoming from '@/components/tasks/Upcoming';
import Completed from '@/components/tasks/Completed';

export default function Tasks() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const [activeTab, setActiveTab] = useState(0); // Track active tab index
  const tabs = [
    { key: "active", title: "Active" },
    { key: "upcoming", title: "Upcoming" },
    { key: "completed", title: "Completed"},

  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Active />;
      case 1:
        return <Upcoming />;
      case 2:
        return <Completed />;
      default:
        return null;
    }
  };

  return (

    <DefaultView backgroundColor={Colors.white}>
      

      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>


        { /* Tasks Header */ }
        <View style={{ width: '100%', paddingTop: 40, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderColor}}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10}}>
            Tasks
          </Text>
        </View>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.greyWhite}}>
          
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
          <DefaultScrollView style={styles.tabContent}>{renderTabContent()}</DefaultScrollView>
          

        </View>

      </View>

      
    </DefaultView>

  )
};

const styles = StyleSheet.create ({
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
      borderRadius: 10,
      width: "95%",
      marginTop: 20,
      marginBottom: 15,
      borderColor:'lightgrey',
      borderWidth: 1,
    },
    tabButton: {
      flex: 1,
      padding: 8,
      alignItems: "center",
      justifyContent: "center",
      margin: 4,
    },
    activeTabButton: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      borderColor:'lightgray',
      borderWidth: 1,
    },
    tabText: {
      fontSize: 14,
      color: "black",
    },
    tabContent: {
      flex: 1,
      width: '95%',
    },
  });