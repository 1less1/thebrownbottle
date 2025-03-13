import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';
import CalendarWidget from '@/components/calendar/CalendarWidget';
import Calendar from '@/components/calendar/Calendar';
import Shifts from '@/components/calendar/Shifts';
import TimeOff from '@/components/calendar/TimeOff';

export default function Tasks() {
  return (
    <DefaultView>

      {/* Top Strip */}
      <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: 55, width: '100%', }} />

      {/* Calendar Header */}
      <View style={{ marginTop: 65, marginBottom: 10, width:'85%' }}>
        <View style={{alignSelf:'flex-start'}}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold' }}>
              Calendar:
          </Text>
        </View>
      </View>

      <Shifts/>

      <Calendar/>

      <TimeOff />

    </DefaultView>
)};
