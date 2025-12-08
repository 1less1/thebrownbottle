import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import CircularImage from '@/components/CircularImage';
import Announcements from '@/components/home/Announcements';
import NextShift from '@/components/home/NextShift';
import QuickStats from '@/components/home/QuickStats';
import ProfileAvatar from '@/components/ProfileAvatar';


// Get Session Data
import { useSession } from '@/utils/SessionContext';

export default function HomeScreen() {
  // Dynamic Status Bar
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


      <View style={{ flex: 1, backgroundColor: Colors.white }}>


        {/* Medium Tan Background that takes up 85% for Over Scroll */}
        <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: '75%', width: '100%' }} />
        {/* Easter Egg - If you delete this, you are BUNS! */}
        <Text style={{ position: 'absolute', top: '75%', width: '100%', textAlign: 'center', padding: 5 }}>Hey Jahmen ;)</Text>


        <DefaultScrollView>


          {/* First Strip */}
          <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: 180, width: '100%' }} />
          {/* Second Strip */}
          <View style={{ backgroundColor: Colors.white, position: 'absolute', top: 150, height: '100%', width: '100%' }} />
          {/* Circular Image */}
          <View style={{ marginTop: 90 }}>
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

          {/* CONTENT */}

          <View style={{ width: '90%' }}>

            {/* Quick Stats */}
            <View>
              <Text style={GlobalStyles.floatingHeaderText}>Quick Stats</Text>
              <QuickStats />
            </View>

            <View style={styles.contentRow}>

              {/* Announcements column */}
              <View style={styles.announcementsColumn}>
                <Announcements />
              </View>

              {/* Next Shift column */}
              <View style={styles.nextShiftColumn}>
                <NextShift employee_id={Number(user?.employee_id) || 0} />
              </View>

            </View>

          </View>

        </DefaultScrollView>

      </View>

    </DefaultView>

  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
  },
  contentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10
  },
  nextShiftColumn: {
    flexBasis: '30%',
    minWidth: 250,
    flexGrow: 1,
    marginVertical: 20,
  },
  announcementsColumn: {
    flexBasis: '55%',
    minWidth: 250,
    flexGrow: 1,
    marginVertical: 20,
  },
  icon: {
    marginRight: 3,
  }
})