import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import Calendar from '@/components/calendar/Calendar';
import Shifts from '@/components/calendar/Shifts';
import TimeOff from '@/components/calendar/TimeOff';

import { testShifts } from '@/data/testShifts';
import { ShiftData } from '@/types/shift';

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
        <View style={{ width: '100%', paddingTop: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.altBorderColor }}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10 }}>
            Calendar
          </Text>
        </View>

        <DefaultScrollView>

           {/* Upcoming Shifts View */}
          <View style={{ width: '85%', marginVertical: 20 }}>
            <Text style={{ textAlign: 'left', fontSize: 18, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Upcoming Shifts</Text>
            <Shifts shifts={testShifts}/>
          </View>

          <View style={{ width: '85%' }}>
            <Calendar shifts={testShifts}/>
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
