import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import CircularImage from '@/components/CircularImage';
import Announcements from '@/components/home/Announcements';
import ClockInWidget from '@/components/home/ClockInWidget';

const styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 5,
    borderTopColor: 'black', 
  },
  topStrip: {
    backgroundColor: Colors.mediumTan,
    position: 'absolute',
    top: 0,
    left: 0,
    height: 100,  // Adjust height to match your design
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
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.mediumTan);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      
      {/* Status Bar Strip */}
      <View style={styles.topStrip} />

      {/* Main Content */}
      <View style={styles.contentContainer}>
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
          <View style={{ width: '85%' }}>
            <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Announcements</Text>
            <Announcements />
          </View>

        </DefaultView>
      </View>

    </View>
  );
}
