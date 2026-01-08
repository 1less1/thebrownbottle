import React, { useState } from "react";
import { View, Text, useWindowDimensions } from 'react-native';

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import DefaultScrollView from "@/components/DefaultScrollView";

import NewTask from "@/components/admin/Tasks/NewTask";
import AdminTasks from "@/components/admin/Tasks/AdminTasks";
import AdminRecurringTasks from "@/components/admin/Tasks/AdminRecurringTasks";

import { useSession } from '@/utils/SessionContext';

const Tasks = () => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;
    const isMobile = WIDTH < 768;

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
                <NewTask onSubmit={handleRefresh} />
            </View>

            {/* Feeds side by side on desktop - Wrap vertically on mobile */}
            <View style={{
                flexDirection: isMobile ? 'column' : 'row',
                marginVertical: 16,
                width: '90%',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>

                <View style={{ width: isMobile ? '100%' : '49%' }}>
                    <Text style={GlobalStyles.floatingHeaderText}>Tasks</Text>
                    <AdminTasks parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
                </View>

                <View style={{ marginTop: isMobile ? 16 : 0, width: isMobile ? '100%' : '49%' }}>
                    <Text style={GlobalStyles.floatingHeaderText}>Recurring Tasks</Text>
                    <AdminRecurringTasks parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
                </View>

            </View>

        </DefaultScrollView>

    );

};

export default Tasks;
