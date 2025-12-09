import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';

import EmpShiftCover from '@/components/calendar/ShiftCover/EmpShiftCover';

import { useSession } from '@/utils/SessionContext';

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

        <DefaultScrollView scrollEnabled={false} refreshing={refreshing} onRefresh={handleRefresh}>

            <View style={{ flex: 1, width: '85%', marginTop: 16 }}>
                <EmpShiftCover parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
            </View>

        </DefaultScrollView>

    );
};

export default ShiftCover;
