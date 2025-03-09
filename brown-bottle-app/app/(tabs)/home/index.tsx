import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import CircularImage from '@/components/CircularImage';
import ClockInCard from '@/components/home/ClockIn';
import AnnouncementsCard from '@/components/home/Announcements';

const styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 5,
    borderTopColor: 'black', 
  },
});


export default function HomeScreen() {
  return (
    
    <DefaultView>

      {/* Top Strip */}
      <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: 140, width: '100%', }} />


      <View style={{ marginTop: 80 }}>
        <CircularImage size={145} />
      </View>


      {/*Greeting Message */}
      <View style={{ marginTop: 10, marginBottom: 40 }}>
        <Text style={{ textAlign: 'center', fontSize: 35, color: 'black', fontWeight: 'bold' }}>
            Hi, User
          </Text>
          <Text style={{ textAlign: 'center', fontSize:15, color: 'black' }}>
            Here's What's Happening...
          </Text>
        </View>


      {/* Clock In View */}
      <View style={{ margin: 20, width: '85%', marginBottom: 60 }}>
        <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 15 }}>Today</Text>
        {/* Clock In Card */}
        <ClockInCard />
      </View>


      {/* Announcements Section */}
      <View style={{ width: '85%' }}>
        <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', fontWeight: "bold", marginBottom: 15 }}>Announcements</Text>

        {/* Announcements Container */}
        <AnnouncementsCard />
      </View>

    </DefaultView>

  );
}



