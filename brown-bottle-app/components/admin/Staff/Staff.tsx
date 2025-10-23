import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { useSession } from '@/utils/SessionContext';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';

import StaffSearch from '@/components/admin/Staff/StaffSearch';

import AddEmp from "@/components/admin/Staff/AddEmp";
import RemoveEmp from "@/components/admin/Staff/RemoveEmp";


const Staff = () => {
  const { user } = useSession();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1); // triggers StaffSearch to refetch

    // Simulate async refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (

    <DefaultScrollView refreshing={refreshing} onRefresh={handleRefresh}>

      <View style={{ marginTop: 16, width: '85%' }}>
        <StaffSearch refreshTrigger={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
      </View>

      <View style={[styles.moduleContainer, { margin: 16, width: '85%' }]}>
        <Card style={styles.moduleCard}>
          <AddEmp/>
        </Card>
        <Card style={styles.moduleCard}>
          <RemoveEmp/>
        </Card>
      </View>

    </DefaultScrollView>

  );

};

const styles = StyleSheet.create({
  moduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  moduleCard: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 10,
  },
});

export default Staff;