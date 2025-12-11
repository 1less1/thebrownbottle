import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';

import Announcements from '@/components/admin/Dashboard/Announcements';
import Tasks from '@/components/admin/Dashboard/Tasks';

import { useSession } from '@/utils/SessionContext';


const Dashboard = () => {
  const { user } = useSession();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (!user) return null;

  return (

    <DefaultScrollView refreshing={refreshing} onRefresh={handleRefresh}>

      <View style={{ marginTop: 16, width: '90%' }}>

        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Announcements user={user} />
          </Card>

          <Card style={styles.card}>
            <Tasks user={user} />
          </Card>

        </View>
      </View>

    </DefaultScrollView >

  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    gap: 12,
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