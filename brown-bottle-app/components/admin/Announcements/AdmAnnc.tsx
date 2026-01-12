import React, { useState } from "react";
import { View } from 'react-native';

import DefaultScrollView from "@/components/DefaultScrollView";

import NewAnnouncement from "@/components/admin/Announcements/AdmNewAnnc";
import AdminAnnouncements from "@/components/admin/Announcements/AdmAnncFeed";

import { useSession } from '@/utils/SessionContext';

const AdmAnnc = () => {
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
                <NewAnnouncement onSubmit={handleRefresh} />
            </View>

            <View style={{ marginVertical: 16, width: '90%' }}>
                <AdminAnnouncements parentRefresh={refreshTrigger} onRefreshDone={() => setRefreshing(false)} />
            </View>

        </DefaultScrollView>

    );

};

export default AdmAnnc;
