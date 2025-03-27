import { StyleSheet, TouchableOpacity} from 'react-native';
import { useState } from 'react';
import DefaultView from '@/components/DefaultView';
import { View, Text, } from 'react-native';
import { Colors } from '@/constants/Colors';
import TaskList from '@/components/tasks/features/TaskList';
import Active from '@/components/tasks/Active';
import Upcoming from '@/components/tasks/Upcoming';
import Completed from '@/components/tasks/Completed';

export default function Tasks() {

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
    
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: Colors.white }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.borderColor}}>
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
      <DefaultView style={styles.tabContent}>{renderTabContent()}</DefaultView>
      
      </View>
     </View>
    
    

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
      marginTop: 10,
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
