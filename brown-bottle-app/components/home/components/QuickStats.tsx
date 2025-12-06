import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import StatCard from '@/components/modular/StatCard';
import { Colors } from '@/constants/Colors';

import { getShift } from '@/routes/shift';
import { getTasks } from '@/routes/task';
import { getTimeOffRequests } from '@/routes/time_off_request';
import { useSession } from '@/utils/SessionContext';

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
     * - Upcoming Shifts Count
     * - Pending Tasks Count (incomplete)
     * - Pending Time Off Requests
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeId = Number(user?.employee_id);
                if (!employeeId) return;

                const now = new Date();

                // FETCH UPCOMING SHIFTS
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
                const tor = await getTimeOffRequests({
                    employee_id: employeeId,
                    status: "Pending",
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


    return (
        <View style={[styles.container, isMobile ? styles.mobile : styles.desktop]}>

            <StatCard
                loading={loading}
                title="Upcoming Shifts"
                value={upcomingCount}
                iconName="time-outline"
                backgroundColor="#eef6ff"
                iconColor="#3b78ff"
                borderColor='#acc4faff'
                iconContainerStyle={{ backgroundColor: "#dbeaff" }}
                titleStyle={{ color: "#3b78ff" }}
                valueStyle={{ color: "#3b78ff" }}
                style={{ marginLeft: 8, marginRight: 8 }}
            />

            <StatCard
                loading={loading}
                title="Pending Tasks"
                value={taskCount}
                iconName="clipboard-outline"
                backgroundColor="#fff3e0"
                iconColor="#ff9800"
                borderColor='#fed79cff'
                iconContainerStyle={{ backgroundColor: "#fde6c4ff" }}
                titleStyle={{ color: "#ff9800" }}
                valueStyle={{ color: "#ff9800" }}
                style={{ marginLeft: 8, marginRight: 8 }}
            />

            {/* DISPLAY LIVE PENDING TOR COUNT */}
            <StatCard
                loading={loading}
                title="Time Off Requests"
                value={pendingTimeOffCount}
                iconName="hourglass-outline"
                backgroundColor="#fbebfcff"
                iconColor="#c780ceff"
                borderColor='#cea9d2ff'
                iconContainerStyle={{ backgroundColor: "#f2d3f5ff" }}
                titleStyle={{ color: "#c780ceff" }}
                valueStyle={{ color: "#c780ceff" }}
                style={{ marginLeft: 8, marginRight: 8 }}
            />

        </View>
    );
};

export default QuickStats;

const styles = StyleSheet.create({
    container: {
        gap: 5,
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
});
