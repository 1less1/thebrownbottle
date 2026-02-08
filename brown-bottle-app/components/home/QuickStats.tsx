import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';

import StatCard from '@/components/modular/StatCard';
import QuickStatsSkeleton from '@/components/ui/skeleton/home/QuickStatsSkeleton';

import { getTask } from '@/routes/task';
import { getShift } from '@/routes/shift';
import { getShiftCoverRequest } from '@/routes/shift_cover_request';
import { getTimeOffRequest } from '@/routes/time_off_request';

import { useSession } from '@/utils/SessionContext';


interface Props {
    parentRefresh?: number;
    onRefreshDone?: () => void;
}

const QuickStats: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [upcomingCount, setUpcomingCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);
    const [shiftCoverCount, setShiftCoverCount] = useState(0);
    const [pendingTimeOffCount, setPendingTimeOffCount] = useState(0);

    const { user } = useSession();

    const router = useRouter();


    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Redirects on click
    const taskRedirect = async () => {
        await delay(200)
        router.push('/(tabs)/tasks');
    }

    const shiftCoverRedirect = async () => {
        await delay(200)
        router.push({
            pathname: '/(tabs)/calendar',
            params: { tab: 'shiftcover' },
        });
    };

    const timeOffRedirect = async () => {
        await delay(200)
        router.push({
            pathname: '/(tabs)/calendar',
            params: { tab: 'timeoff' },
        });
    }


    /**
     * FETCH ALL STATS FOR QUICK STATS CARDS
     * - Pending Tasks Count (incomplete)
     * - Pending/Awaiting Approval Shift Cover Requests
     * - Pending Time Off Requests
     */
    const fetchData = useCallback(async (isInitial = false) => {
        const employeeId = Number(user?.employee_id);
        if (!employeeId) return;

        if (isInitial) {
            setLoading(true);
            await delay(500);
        } else {
            setRefreshing(true);
        }

        try {
            // Fetch PENDING and AWAITING APPROVAL Shift Cover Requests
            const shiftCoverData = await getShiftCoverRequest({
                requested_employee_id: employeeId,
                status: ["Pending", "Awaiting Approval"]
            })
            setShiftCoverCount(shiftCoverData.length)

            // Fetch PENDING Tasks
            const todaysShift = await getShift({
                employee_id: employeeId,
                is_today: 1,
            });

            if (!todaysShift || todaysShift.length === 0) {
                setTaskCount(0);
            } else {
                const section_id = todaysShift[0].section_id;
                const tasks = await getTask({
                    section_id: section_id,
                    complete: 0,
                });
                setTaskCount(tasks.length);
            }

            // Fetch PENDING Time Off Requests
            const tor = await getTimeOffRequest({
                employee_id: employeeId,
                status: ["Pending"],
            });

            setPendingTimeOffCount(tor.length);

        } catch (error: any) {
            console.log("There was an error fetching quick stats:", error.message)
            setUpcomingCount(0);
            setTaskCount(0);
            setPendingTimeOffCount(0);
        } finally {
            if (isInitial) {
                setLoading(false);
            } else {
                setRefreshing(false);
            }
        }
    }, [user?.employee_id]);

    // Fetch quick stats on initalization and state update
    useEffect(() => {
        fetchData(true); // Initial Load

        const interval = setInterval(() => {
            fetchData(false); // SILENT Polling
        }, 20000); // Every 20 seconds

        return () => clearInterval(interval);
    }, [parentRefresh, fetchData]);


    if (loading) {
        return <QuickStatsSkeleton />;
    }

    return (

        <View style={[styles.container, isMobile ? styles.mobile : styles.desktop]}>

            <StatCard
                loading={loading}
                title="Pending Tasks"
                value={taskCount}
                iconName="clipboard-outline"
                backgroundColor={Colors.bgYellow}
                iconColor={Colors.pendingYellow}
                borderColor={Colors.borderYellow}
                iconContainerStyle={{ backgroundColor: Colors.bgIconYellow }}
                titleStyle={{ color: Colors.pendingYellow }}
                valueStyle={{ color: Colors.pendingYellow }}
                style={styles.card}
                onPress={taskRedirect}
            />

            <StatCard
                loading={loading}
                title="Shift Cover Requests"
                value={shiftCoverCount}
                iconName="repeat-outline"
                backgroundColor={Colors.bgBlue}
                iconColor={Colors.blue}
                borderColor={Colors.borderBlue}
                iconContainerStyle={{ backgroundColor: Colors.bgIconBlue }}
                titleStyle={{ color: Colors.blue }}
                valueStyle={{ color: Colors.blue }}
                style={styles.card}
                onPress={shiftCoverRedirect}
            />

            <StatCard
                loading={loading}
                title="Time Off Requests"
                value={pendingTimeOffCount}
                iconName="hourglass-outline"
                backgroundColor={Colors.bgPurple}
                iconColor={Colors.purple}
                borderColor={Colors.borderPurple}
                iconContainerStyle={{ backgroundColor: Colors.bgIconPurple }}
                titleStyle={{ color: Colors.purple }}
                valueStyle={{ color: Colors.purple }}
                style={styles.card}
                onPress={timeOffRedirect}
            />

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
        width: '100%',
    },
    mobile: {
        flexDirection: 'column',
    },
    desktop: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        height: 110,
        padding: 18,
        marginBottom: 8,
        marginRight: 2,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});

export default QuickStats;