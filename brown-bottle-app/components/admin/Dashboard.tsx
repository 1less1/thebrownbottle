import DefaultView from '@/components/DefaultView';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/Card';
import { Colors } from '@/constants/Colors';
import Announcements from './features/Announcements';
import TimeOff from './features/TimeOff';
import AssignTasks from './features/AssignTasks';

export default function Dashboard() {
  return (
    <DefaultView>
      
      <View style={{ marginTop: 10, width: '85%' }}>

        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            < Announcements />
          </Card>

          <Card style={styles.card}>
            <AssignTasks/>
          </Card>
        </View>
      </View>

    <View style={{ marginTop: 10, width: '85%' }}>
    <Text style={{textAlign:'left', fontSize: 20, color: 'black', fontWeight: 'bold' }}>
     Time Off Requests
    </Text>
    
      <TimeOff/>

    </View>

    </DefaultView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', // Align cards side by side
    justifyContent: 'space-between', // Distribute space evenly between cards
    flexWrap: 'wrap', // Allow wrapping if the screen is small
    paddingBottom: 25,
    paddingTop: 10,
  },
  card: {
    width: '48%', // Cards take up 48% of the width, leaving 2% for spacing
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 8,
  },
});
