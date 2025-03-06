import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { CircularImage } from '@/components';

import DefaultView from '@/components/DefaultView';
import ClockInCard from '@/components/ClockIn';
import AnnouncementsCard from '@/components/Announcements';

const styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 5, // Specifies the thickness of the top border
    borderTopColor: 'black', // Specifies the color of the top border
  },
});

export default function HomeScreen() {
  return (
    
    <DefaultView>

      {/* Top Strip */}
      <View style={{ backgroundColor: Colors.lightTan, position: 'absolute', top: 0, height: 140, width: '100%', }} />

      <View style={{ marginTop: 80 }}>
        <CircularImage size={120} />
      </View>

      {/* Add Hi, User */}

      <View style={{ marginTop: 15, marginBottom: 40 }}>
        <Text style={{ textAlign: 'center', fontSize: 35, color: 'black', fontWeight: 'bold' }}>
            Hi, User {/* Replace with user's name */}
          </Text>
          <Text style={{ textAlign: 'center', fontSize:15, color: 'black' }}>
            Here's What's Happening
          </Text>
        </View>

      {/* Clock In View */}
      <View style={{ margin: 20, width: '90%', marginBottom: 60 }}>
        <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 15 }}>Today</Text>

        {/* Clock In Card */}
        <ClockInCard />
      </View>

      {/* Announcements Section */}
      <View style={{ width: '90%' }}>
        <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 15 }}>Announcements</Text>

        {/* Announcements Container */}
        <AnnouncementsCard />
      </View>
    </DefaultView>


  );
}



