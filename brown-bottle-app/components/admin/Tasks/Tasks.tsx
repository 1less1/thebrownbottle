import React, { useState } from "react";
import { View } from 'react-native';

import DefaultScrollView from "@/components/DefaultScrollView";

import NewTask from "@/components/admin/Tasks/NewTask";

import { useSession } from '@/utils/SessionContext';

const Tasks = () => {
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

        </DefaultScrollView>

    );

};

export default Tasks;
