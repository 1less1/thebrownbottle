import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Employee } from "@/types/iEmployee";
import StatCard from "../modular/StatCard";

interface Props {
  profile: Employee | null;
}
const ProfileStats: React.FC<Props> = ({ profile }) => {
  if (!profile) return null; // Avoid crashing while loading

  return (
    <View>
      <StatCard
        title="Stat 1"
        value={1}
        iconName="time-outline"
        backgroundColor="#eef6ff"
        iconColor="#3b78ff"
        borderColor='#acc4faff'
        iconContainerStyle={{ backgroundColor: "#dbeaff" }}
        titleStyle={{ color: "#3b78ff" }}
        valueStyle={{ color: "#3b78ff" }}
        
      />

      <StatCard
        title="Stat 2"
        value={2}
        iconName="clipboard-outline"
        backgroundColor="#fff3e0"
        iconColor="#ff9800"
        borderColor='#fed79cff'
        iconContainerStyle={{ backgroundColor: "#fde6c4ff" }}
        titleStyle={{ color: "#ff9800" }}
        valueStyle={{ color: "#ff9800" }}
      />

      <StatCard
        title="Stat 3"
        value={3}
        iconName="hourglass-outline"
        backgroundColor="#fbebfcff"
        iconColor="#c780ceff"
        borderColor='#cea9d2ff'
        iconContainerStyle={{ backgroundColor: "#f2d3f5ff" }}
        titleStyle={{ color: "#c780ceff" }}
        valueStyle={{ color: "#c780ceff" }}
      />
    </View>
  );
};

export default ProfileStats
