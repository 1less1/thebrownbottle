import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';

import Card from "@/components/modular/Card";
import CalendarWidget from '@/components/calendar/CalendarWidget';
import LoadingCircle from '../modular/LoadingCircle';
import { useSession } from '@/utils/SessionContext';

interface CalendarProps {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const Calendar: React.FC<CalendarProps>  = ({ parentRefresh, onRefreshDone }) => {

  const { user } = useSession();

  if (!user) {
    return (
      <Card style={styles.container}>
        <LoadingCircle size={"large"}/>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <CalendarWidget
        key={parentRefresh}   // ✅ Forces re-mount on parent refresh
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