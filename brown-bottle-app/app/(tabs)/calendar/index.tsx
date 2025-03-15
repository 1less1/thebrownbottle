import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';
import CalendarWidget from '@/components/calendar/CalendarWidget';
import Calendar from '@/components/calendar/Calendar';
import Shifts from '@/components/calendar/Shifts';
import TimeOff from '@/components/calendar/TimeOff';

interface EventData {
  visible: true;
  isShift: boolean;
  date: string | null;
  shiftTime?: string | null;
  role?: string | null;
  events?: string[] |null;
}

const events: { [key: string]: EventData } = {
  '2025-03-15': {
    visible: true,
    isShift: true,
    date: '2025-03-15',
    shiftTime: '9:00 AM - 5:00 PM',
    role: 'Server',
  },
  '2025-03-28': {
    visible: true,
    isShift: true,
    date: '2025-03-28',
    shiftTime: '4:00 PM-8:45 PM',
    role: 'Bartender'
  },
  '2025-04-28': {
    visible: true,
    isShift: false,
    date: '2025-04-28',
    events: ['New Schedules due'],
  },
};

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

      <Shifts events={events}/>

      <Calendar events={events}/>

      <TimeOff />

    </DefaultView>
)};
