import React, { useState } from "react";
import { View } from 'react-native';
import { useSession } from '@/utils/SessionContext';
import DefaultScrollView from '@/components/DefaultScrollView';
import SpreadSheet from "@/components/admin/Schedule/SpreadSheet";

const Schedule = () => {
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

      <View style={{ marginTop: 8, width: '96%' }}>
        <SpreadSheet parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
      </View>

    </DefaultScrollView>

  );

};

export default Schedule;
