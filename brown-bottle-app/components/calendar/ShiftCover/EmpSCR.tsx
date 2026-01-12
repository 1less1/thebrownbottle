import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import EmpSCRFeed from '@/components/calendar/ShiftCover/EmpSCRFeed';

const EmpSCR = () => {

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

        <DefaultScrollView scrollEnabled={false} refreshing={refreshing} onRefresh={handleRefresh}>

            <View style={{ flex: 1, width: '90%', marginTop: 16 }}>
                <EmpSCRFeed parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
            </View>

        </DefaultScrollView>

    );
};

export default EmpSCR;
