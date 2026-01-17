import React, { useState } from "react";
import { View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import AdmTORFeed from "@/components/admin/TimeOff/AdmTORFeed";

const AdmTOR = () => {

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

      <View style={{ flex: 1, width: '90%', marginTop: 16 }}>
        <AdmTORFeed parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
      </View>

    </DefaultScrollView>

  );

};

export default AdmTOR;
