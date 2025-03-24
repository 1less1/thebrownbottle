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

// Key/Value Pairs
// The Date is the "Key", the values are defined below
// When pulling the data for each event from the backend, I am going to want to automatically assign "visible: true"
// to all of the event objects after reading in all of the other attrubutes.
const events: { [key: string]: EventData } = {
  '2025-03-17': {
    visible: true,
    isShift: true,
    date: '2025-03-17',
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
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: Colors.white }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.borderColor}}>
        <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10}}>
                Calendar
            </Text>
     </View>

    <DefaultView>


      {/* Upcoming Shifts View */}
      <View style={{ width: '85%', marginVertical: 20 }}>
        <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Upcoming Shifts</Text>
        <Shifts events={events}/>
      </View>

      <View style={{ width: '85%' }}>
        <Calendar events={events}/>
      </View>

      {/* Time Off View */}
      <View style={{ width: '85%', marginVertical: 20 }}>
        <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Time Off Requests</Text>
        <TimeOff/>
      </View>

    </DefaultView>
    </View>
)};
