import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
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
  '2025-04-11': {
    visible: true,
    isShift: true,
    date: '2025-04-11',
    shiftTime: '9:00 AM - 5:00 PM',
    role: 'Server',
  },
  '2025-04-15': {
    visible: true,
    isShift: true,
    date: '2025-04-15',
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
  // Dynamic Status Bar
    useFocusEffect(
      useCallback(() => {
        StatusBar.setBackgroundColor(Colors.white);
        StatusBar.setBarStyle('dark-content');
      }, [])
    );
  
  return (

    <DefaultView backgroundColor={Colors.white}>


      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>


        { /* Calendar Header */ }
        <View style={{ width: '100%', paddingTop: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderColor }}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10 }}>
            Calendar
          </Text>
        </View>

        <DefaultScrollView>

           {/* Upcoming Shifts View */}
          <View style={{ width: '85%', marginVertical: 20 }}>
            <Text style={{ textAlign: 'left', fontSize: 18, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Upcoming Shifts</Text>
            <Shifts events={events}/>
          </View>

          <View style={{ width: '85%' }}>
            <Calendar events={events}/>
          </View>

          {/* Time Off View */}
          <View style={{ width: '85%', marginTop: 20, marginBottom: 60 }}>
            <Text style={{ textAlign: 'left', fontSize: 18, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Time Off Requests</Text>
            <TimeOff/>
          </View>

        </DefaultScrollView>


      </View>


    </DefaultView>

  )
};
