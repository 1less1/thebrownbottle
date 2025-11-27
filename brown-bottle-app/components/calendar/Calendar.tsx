import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';

import Card from "@/components/modular/Card";
import CalendarWidget from '@/components/calendar/CalendarWidget';
import LoadingCircle from '../modular/LoadingCircle';
import { useSession } from '@/utils/SessionContext';

const Calendar = ({ refreshKey }: { refreshKey: number }) => {
  const { user } = useSession();

  if (!user) {
    return (
      <Card style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
        <LoadingCircle />
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <CalendarWidget 
        key={refreshKey}
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
    padding: 16,
    margin: 14,
  },
});

export default Calendar;