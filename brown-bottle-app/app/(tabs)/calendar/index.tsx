import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import Calendar from '@/components/calendar/Calendar';
import CalendarTimeOff from '@/components/calendar/timeOff/CalendarTimeOff';
import ShiftCover from '@/components/calendar/shiftCover/ShiftCover';

import { testShifts } from '@/data/testShifts';

export default function CalendarPage() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setRefreshing(false), 300);
  }, []);

  return (

    <DefaultView backgroundColor={Colors.white}>

      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>

        {/* Calendar Header */}
        <View style={GlobalStyles.pageHeaderContainer}>
          <Text style={GlobalStyles.pageHeader}>
            Calendar
          </Text>
        </View>

        <DefaultScrollView refreshing={refreshing} onRefresh={handleRefresh}>
          {/* Upcoming Shifts View */}
          <View style={{ width: '85%', marginVertical: 20 }}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              Shift Cover
            </Text>
            <ShiftCover refreshKey={refreshKey} />
          </View>

          <View style={{ width: '85%' }}>
            <Calendar refreshKey={refreshKey} />
          </View>

          {/* Time Off View */}
          <View style={{ width: '85%', marginTop: 20, marginBottom: 60 }}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              Time Off Requests
            </Text>
            <CalendarTimeOff refreshKey={refreshKey} />
          </View>

        </DefaultScrollView>

      </View>

    </DefaultView>

  );

};
