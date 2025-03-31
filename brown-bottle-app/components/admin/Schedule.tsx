import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DefaultScrollView from "@/components/DefaultScrollView";
import WeeklyView from "./features/WeeklyView";
import PositionView from "./features/PositionView";
import { Colors } from "@/constants/Colors";

export default function Admin() {
  const [activeTab, setActiveTab] = useState(0); // Track active tab index
  const tabs = [
    { key: "weeklyview", title: "Weekly View" },
    { key: "sortby", title: "Position" },

  ];

  // Function to render the content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <WeeklyView />;
      case 1:
        return <PositionView />;
      default:
        return null;
    }
  };

  return (
    <DefaultScrollView>
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
      </DefaultScrollView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderRadius: 10,
    width: "95%",
    marginTop: 10,
    marginBottom: 15,
    borderColor:'lightgray',
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

