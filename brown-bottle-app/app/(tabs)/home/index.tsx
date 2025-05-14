import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import CircularImage from '@/components/CircularImage';
import Announcements from '@/components/home/Announcements';
import NextShift from '@/components/home/NextShift';

import Card from '@/components/modular/Card';
import AltCard from '@/components/modular/AltCard';

// Get Session Data
import { useSession } from '@/utils/SessionContext';

export default function HomeScreen() {
  // Dynamic Status Bar (Android Only)
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.mediumTan);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  // Get session data
  const { user } = useSession();

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
          <View style={{ backgroundColor: Colors.greyWhite, position: 'absolute', top: 150, height: '100%', width: '100%' }} />
          {/* Circular Image */}
          <View style={{ marginTop: 90}}>
            <CircularImage size={145} />
          </View>

          

          {/* Greeting Message */}
          <View style={{ marginTop: 10, marginBottom: 40 }}>
            <Text style={{ textAlign: 'center', fontSize: 35, color: 'black', fontWeight: 'bold' }}>
              Hi, {user?.first_name ?? 'Guest'}!
            </Text>
            <Text style={GlobalStyles.mediumText}>
              Here's What's Happening...
            </Text>
          </View>

          {/* Next Shift View */}
          <View style={{ marginVertical: 25, width: '85%' }}>
            <Text style={GlobalStyles.floatingHeaderText}>Your Next Shift</Text>
            <NextShift employee_id={Number(user?.user_id) || 0} />
          </View>


          {/* Announcements View */}
          <View style={{ width: '85%', marginTop: 25, marginBottom: 60 }}>
            <Text style={GlobalStyles.floatingHeaderText}>Announcements</Text>
            <Announcements />
          </View>
          

        </DefaultScrollView>
        

      </View>


    </DefaultView>            

  );
}