import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import CircularImage from '@/components/CircularImage';
import Announcements from '@/components/home/Announcements';
import ClockInWidget from '@/components/home/ClockInWidget';

const styles = StyleSheet.create({
  topStrip: {
    backgroundColor: Colors.mediumTan,
    position: 'absolute',
    top: 0,
    left: 0,
    height: 120,  // Adjust height to match your design
    width: '100%',
    zIndex: 10,  // Ensure it is above other content
  },
  contentContainer: {
    flex: 1,
    marginTop: 80, // Add space so the content doesn't overlap with the strip
    backgroundColor: Colors.white, // Rest of the screen background
  },
});

export default function HomeScreen() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.mediumTan);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    <View style={{ flex: 1, }}>
        <DefaultView>

          {/* Continued... Strip */}
          <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: 140, width: '100%', }} />
          
          {/* Circular Image */}
          <View style={{ marginTop: 60 }}>
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

          {/* Clock In View */}
          <View style={{ margin: 40, width: '85%' }}>
            <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Today</Text>
            <ClockInWidget />
          </View>

          {/* Announcements View */}
          <View style={{ width: '85%', marginBottom: 60 }}>
            <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Announcements</Text>
            <Announcements />
          </View>

        </DefaultView>

    </View>
  );
}