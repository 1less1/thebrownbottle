import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import StatCard from '@/components/modular/StatCard';

const QuickStats = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <View style={[styles.container, isMobile ? styles.mobile : styles.desktop]}>

      <StatCard
        title="Upcoming Shifts"
        value={0}
        iconName="time-outline"
        backgroundColor="#eef6ff"
        iconColor="#3b78ff"
        iconContainerStyle={{ backgroundColor: "#dbeaff" }}
        titleStyle={{ color: "#3b78ff" }}
        valueStyle={{ color: "#3b78ff" }}
      />

      <StatCard
        title="Completed"
        value={7}
        iconName="checkmark-done-circle"
        backgroundColor="#e9ffe9"
        iconColor="#2e9d42"
        iconContainerStyle={{ backgroundColor: "#c9f5d1" }}
        titleStyle={{ color: "#2e9d42" }}
        valueStyle={{ color: "#2e9d42" }}
      />

      <StatCard
        title="Late"
        value={2}
        iconName="alert-circle-outline"
        backgroundColor="#ffecec"
        iconColor="#d63a3a"
        iconContainerStyle={{ backgroundColor: "#ffd2d2" }}
        titleStyle={{ color: "#d63a3a" }}
        valueStyle={{ color: "#d63a3a" }}
      />

    </View>
  );
};

export default QuickStats;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: '100%',
  },

  // Mobile: 1 card per row
  mobile: {
    flexDirection: 'column',
  },

  // Desktop/tablet: 3 in one row
  desktop: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
});