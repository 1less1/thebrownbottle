import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import AnimatedTouchableWrapper from "../modular/AnimatedTouchable";

/**
 * Sidebar Component (Web Only)
 * - Displays vertical navigation for admin tabs
 * - Uses setActiveTab to switch pages
 */
const Sidebar = ({
  tabs = [], // Default fallback
  activeTab = 0, // Default fallback
  setActiveTab = () => { }, // Default fallback
}: {
  tabs?: { key: string; title: string; component: React.ReactNode }[];
  activeTab?: number;
  setActiveTab?: (index: number) => void;
}) => {

  // If no tabs passed, render nothing to avoid map crash
  if (!tabs || !Array.isArray(tabs) || tabs.length === 0) {
    return null;
  }
  console.log("Sidebar tabs:", tabs);


  return (
    <View style={styles.container}>

      {tabs.map((tab, index) => (
        <Pressable
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === index && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab(index)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === index && styles.activeTabText,
            ]}
          >
            {tab.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    width: 225,
    backgroundColor: Colors.white,
    borderLeftWidth: 0.8,
    borderLeftColor: Colors.borderColor,
    paddingTop: 60,
    paddingBottom: 30,
  },
  tabItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 16,
    color: Colors.gray,
  },
  activeTabItem: {
    backgroundColor: Colors.bgApp,
    borderLeftWidth: 4,
    borderLeftColor: Colors.borderColor,
  },
  activeTabText: {
    fontWeight: "600",
    color: Colors.black,
  },
});
