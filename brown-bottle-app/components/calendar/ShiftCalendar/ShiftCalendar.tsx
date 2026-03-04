import React from "react";
import { View } from 'react-native';

import DefaultScrollView from '@/components/DefaultScrollView';
import Calendar from '@/components/calendar/Calendar';
import { useShiftRefresh } from '@/utils/ShiftRefreshContext';

const ShiftCalendar = () => {
    const { refreshTrigger } = useShiftRefresh();

    return (
        <DefaultScrollView scrollEnabled={false}>
            <View style={{ flex: 1, width: '90%', marginTop: 16 }}>
                <Calendar parentRefresh={refreshTrigger} />
            </View>
        </DefaultScrollView>
    );
};

export default ShiftCalendar;
