import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from "@/components/modular/Card";
import AltCard from '@/components/modular/AltCard';

import CalendarWidget from '@/components/calendar/CalendarWidget';

import { useSession } from '@/utils/SessionContext';

interface CalendarProps {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ parentRefresh, onRefreshDone }) => {

  const { user } = useSession();

  return (
    <Card style={styles.container}>
      <CalendarWidget
        parentRefresh={parentRefresh}   // Forces re-mount on parent refresh
        mode="calendar"
        showShifts
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20
  },
});

export default Calendar;