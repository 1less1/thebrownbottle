import DefaultScrollView from '@/components/DefaultScrollView';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/modular/Card';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { User } from '@/utils/SessionContext'; // Import User type from SessionContext
import Announcements from '@/components/admin/Dashboard/Announcements';
import Tasks from '@/components/admin/Dashboard/Tasks';

interface DashboardProps {
  user: User; // Make sure to define `User` type properly, based on your session data structure
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  
  return (

    <DefaultScrollView >
      
      <View style={{ marginTop: 10, width: '85%'}}>

        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Announcements user={user} />
          </Card>

          <Card style={styles.card}>
            <Tasks user={user} />
          </Card>

        </View>
      </View>

      <View style={{ marginTop: 10, width: '85%' }}>

        <Text style={GlobalStyles.floatingHeaderText}>
          Announcement Feed - Will be able to edit and delete announcments here
        </Text>

        <Text style={GlobalStyles.floatingHeaderText}>
          Normal Task Feed - Will be able to edit and delete tasks here (sort by Section)
        </Text>

        <Text style={GlobalStyles.floatingHeaderText}>
          Recurring Task Feed - Will be able to edit and delete tasks here (sort by Section)
        </Text>


      </View>

    </DefaultScrollView>

  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingBottom: 25,
    paddingTop: 10,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 8,
  },
});

export default Dashboard;