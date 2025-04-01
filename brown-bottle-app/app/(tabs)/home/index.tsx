import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import CircularImage from '@/components/CircularImage';
import Announcements from '@/components/home/Announcements';
import ClockInWidget from '@/components/home/ClockInWidget';
import NextShift from '@/components/home/NextShift';

import Card from '@/components/Card';
import AltCard from '@/components/AltCard';

interface EventData {
  visible: true;
  isShift: boolean;
  date: string | null;
  shiftTime?: string | null;
  role?: string | null;
  events?: string[] |null;
}

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



export default function HomeScreen() {
  // Dynamic Status Bar (Android Only)
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.mediumTan);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (

    <DefaultView backgroundColor={Colors.mediumTan}>


      <View style={{flex: 1, backgroundColor: Colors.greyWhite}}>


        {/* Medium Tan Background that takes up 85% for Over Scroll */}
        <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: '75%', width: '100%' }} />
        {/* Easter Egg - If you delete this, you are BUNS! */}
        <Text style={{ position: 'absolute', top: '75%', width:'100%', textAlign: 'center', padding: 5}}>Hey Jahmen ;)</Text>
        

        <DefaultScrollView>

          
          {/* First Strip */}
          <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: 180, width: '100%' }} />
          {/* Second Strip */}
          <View style={{ backgroundColor: Colors.greyWhite, position: 'absolute', top: 180, height: '100%', width: '100%' }} />
          {/* Circular Image */}
          <View style={{ marginTop: 110}}>
            <CircularImage size={145} />
          </View>

          

          {/* Greeting Message */}
          <View style={{ marginTop: 10, marginBottom: 40 }}>
            <Text style={{ textAlign: 'center', fontSize: 35, color: 'black', fontWeight: 'bold' }}>
              Hi, User
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 15, color: 'black' }}>
              Here's What's Happening...
            </Text>
          </View>

          {/* Clock In View 
          <View style={{ margin: 40, width: '85%' }}>
            <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Today</Text>
            <ClockInWidget />
          </View>
          */}

          {/* Next Shift View */}
          <View style={{ marginVertical: 25, width: '85%' }}>
            <Text style={{ textAlign: 'left', fontSize: 18, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Upcoming</Text>
            <NextShift events={events} />
          </View>


          {/* Announcements View */}
          <View style={{ width: '85%', marginTop: 25, marginBottom: 60 }}>
            <Text style={{ textAlign: 'left', fontSize: 18, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Announcements</Text>
            <Announcements />
          </View>
          

        </DefaultScrollView>
        

      </View>


    </DefaultView>            

  );
}

const styles = StyleSheet.create({
  // Add styles later!
});