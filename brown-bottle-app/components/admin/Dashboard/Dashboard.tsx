import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { User, useSession } from '@/utils/SessionContext';

import { useState } from 'react';

import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';

import Announcements from '@/components/admin/Dashboard/Announcements';
import Tasks from '@/components/admin/Dashboard/Tasks';
import TimeOffView from '@/components/calendar/TimeOff/AdminTimeOff';
import ShiftCoverView from '@/components/calendar/ShiftCover/ShiftCoverView';



const Dashboard = () => {

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setRefreshing(false), 800);
  };

  const { user } = useSession();

  if (!user) return null;
  return (

    <DefaultScrollView refreshing={refreshing} onRefresh={handleRefresh}>

      <View style={{ marginTop: 16, width: '85%' }}>

        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Announcements user={user} />
          </Card>

          <Card style={styles.card}>
            <Tasks user={user} />
          </Card>

        </View>
      </View>

      <View style={{ width: '85%', marginVertical: 16, gap: 16 }}>

        <View>
          <Text style={GlobalStyles.floatingHeaderText}>Time Off Requests</Text>
          <Card style={[styles.card, { padding: 10, width: '100%' }]}>
            <TimeOffView />
          </Card>
        </View>

        <View>
          <Text style={GlobalStyles.floatingHeaderText}>Shift Cover Requests</Text>
          <Card style={[styles.card, { padding: 10, width: '100%' }]}>
            <ShiftCoverView />
          </Card>
        </View>

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

    </DefaultScrollView >

  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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