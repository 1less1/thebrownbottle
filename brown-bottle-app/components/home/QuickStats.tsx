import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import StatCard from '@/components/modular/StatCard';
import { Colors } from '@/constants/Colors';

import { getShift } from '@/routes/shift';
import { getTasks } from '@/routes/task';
import { getTimeOffRequest } from '@/routes/time_off_request';
import { useSession } from '@/utils/SessionContext';

import QuickStatsSkeleton from '../ui/skeleton/home/QuickStatsSkeleton';

const QuickStats = () => {
    const [loading, setLoading] = useState(true);

    const [upcomingCount, setUpcomingCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);
    const [pendingTimeOffCount, setPendingTimeOffCount] = useState(0);

    const { width } = useWindowDimensions();
    const { user } = useSession();

    const isMobile = width < 750;

    /**
     * FETCH ALL STATS FOR QUICK STATS CARDS
     * (Logic omitted for brevity)
     */
    useEffect(() => {
        const fetchData = async () => {
            // ... (keep your existing fetchData logic)
            try {
                const employeeId = Number(user?.employee_id);
                if (!employeeId) return;

                const now = new Date();

                // FETCH UPCOMING SHIFTS >> Change to Shift Cover Requests!!!!
                const shiftData = await getShift({ employee_id: employeeId });

                const futureShifts = shiftData.filter((shift: any) => {
                    const shiftDate = new Date(`${shift.date}T00:00:00`);
                    return shiftDate > now;
                });

                setUpcomingCount(futureShifts.length);

                // FETCH PENDING TASKS
                const todaysShift = await getShift({
                    employee_id: employeeId,
                    is_today: 1,
                });

                if (!todaysShift || todaysShift.length === 0) {
                    setTaskCount(0);
                } else {
                    const section_id = todaysShift[0].section_id;
                    const tasks = await getTasks({
                        section_id,
                        complete: 0,
                    });
                    setTaskCount(tasks.length);
                }

                // FETCH PENDING TIME OFF REQs
                const tor = await getTimeOffRequest({
                    employee_id: employeeId,
                    status: ["Pending"],
                });

                setPendingTimeOffCount(tor.length);

            } catch (err) {
                console.error("QuickStats error:", err);
                setUpcomingCount(0);
                setTaskCount(0);
                setPendingTimeOffCount(0);
            } finally {
                setLoading(false);
            }
        };

        // **Run immediately**
        fetchData();

        //POLLING INTERVAL — Refresh every 10 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 10000); // 10,000 ms = 10 seconds

        // Cleanup when component unmounts
        return () => clearInterval(interval);

    }, [user?.employee_id]);

    if (loading) {
        // Render the skeleton when data is still loading
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
            />

            <StatCard
                loading={loading}
                title="Shift Cover Requests"
                value={upcomingCount}
                iconName="repeat-outline"
                backgroundColor={Colors.bgBlue}
                iconColor={Colors.blue}
                borderColor={Colors.borderBlue}
                iconContainerStyle={{ backgroundColor: Colors.bgIconBlue }}
                titleStyle={{ color: Colors.blue }}
                valueStyle={{ color: Colors.blue }}
                style={styles.card} 
            />

            {/* DISPLAY LIVE PENDING TOR COUNT */}
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
            />

        </View>
    );
};

export default QuickStats;

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