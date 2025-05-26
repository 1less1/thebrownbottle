import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useEffect, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import TaskList from '@/components/tasks/TaskList';
import Active from '@/components/tasks/Active/Active';
import Completed from '@/components/tasks/Completed/Completed';
import LoadingCircle from '@/components/modular/LoadingCircle';

// Get Session Data
import { useSession } from '@/utils/SessionContext';
import { Task, Section } from '@/types/api';
import { getAllSections } from '@/utils/api/section';

export default function Tasks() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const { user } = useSession();
  const [activeTab, setActiveTab] = useState(0);


  const [sections, setSections] = useState<Section[]>([]);
  // Fetch Sections
  useEffect(() => {
      async function loadSections() {
          const data = await getAllSections();
          setSections(data);
          //setSelectedSectionName(data[0].section_name);
      }
      loadSections();
  }, []);


  // Define available tabs and corresponding components
  const tabs = [
    { key: 'active', title: 'Active', component: user && sections ? <Active user={user} sections={sections} /> : 
    <LoadingCircle
      size="large"
      style={{ marginTop: 40, alignSelf: 'center' }}
    /> },

    { key: 'completed', title: 'Completed', component: user && sections ? <Completed user={user} sections={sections}/> : 
    <LoadingCircle
      size="large"
      style={{ marginTop: 40, alignSelf: 'center' }}
    /> },
  ];


  return (

    <DefaultView backgroundColor={Colors.white}>

      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>

        { /* Tasks Header */ }
        <View style={{ width: '100%', paddingTop: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.altBorderColor}}>
          
          <Text style={GlobalStyles.pageHeader}>Tasks</Text>

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
          {tabs[activeTab]?.component}
        </View>
              
      </View>
      
    </DefaultView>

  );
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
      alignSelf: 'center',
      flexDirection: "row",
      borderRadius: 10,
      width: "90%",
      marginTop: 20,
      marginBottom: 15,
      borderColor:'lightgrey',
      borderWidth: 1,
    },
    tabButton: {
      flex: 1,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      margin: 4,
    },
    activeTabButton: {
      backgroundColor: 'white',
      borderRadius: 10,
      borderColor: Colors.darkTan,
      borderWidth: 1,
    },
    tabText: {
      fontSize: 16,
      color: "black",
    },
    tabContent: {
      flex: 1,
      width: '85%',
      alignItems: 'center',
      alignSelf: 'center',
    },
  });