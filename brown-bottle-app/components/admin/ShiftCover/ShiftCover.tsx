import React, { useState } from "react";
import { View } from 'react-native';
import { useSession } from '@/utils/SessionContext';
import DefaultScrollView from '@/components/DefaultScrollView';
import AdminShiftCover from "@/components/admin/ShiftCover/AdminShiftCover";

const ShiftCover = () => {
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

  return (

    <DefaultScrollView refreshing={refreshing} onRefresh={handleRefresh}>

      <View style={{ marginTop: 16, width: '90%' }}>
        <AdminShiftCover parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
      </View>

    </DefaultScrollView>

  );

};

export default ShiftCover;
