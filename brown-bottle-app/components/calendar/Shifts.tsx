import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import Card from "@/components/modular/Card";
import AltCard from '../modular/AltCard';

import { ShiftData } from '@/types/iShift';

interface Props {
    shifts: ShiftData[];
}

const Shifts: React.FC<Props> = ({ shifts }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparisons

    // Get the next two upcoming shifts
    const upcomingShifts = Object.values(shifts)
        .filter(shift => shift.visible && shift.date) // Ensure event is a shift and visible
        .filter(shift => new Date(shift.date!) >= today) // Only future dates
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()) // Sort by date
        .slice(0, 3); // Get the next three upcoming shifts

    if (upcomingShifts.length === 0) {
        return (
            <Card style={styles.container}>
                <Text style={styles.noShiftsText}>No Upcoming Shifts...</Text>
            </Card>
        );
    }

    return (
        <Card style={styles.container}>
            {upcomingShifts.map((shift, index) => (
                <AltCard key={index} style={styles.shiftCard}>
                    <Text style={styles.dateText}>Date: {shift.date}</Text>
                    {shift.startTime && <Text style={styles.styledText}>Shift Time: {shift.startTime}</Text>}
                    {shift.role && <Text style={styles.styledText}>Role: {shift.role}</Text>}
                </AltCard>
            ))}
        </Card>
    );
};



const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    shiftCard: {
        width: '100%',
        backgroundColor: Colors.lightTan,
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 12,
        margin: 6,
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black,
    },
    styledText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.black,

    },
    noShiftsText: {
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'italic',
        color: Colors.gray,

    },
});

export default Shifts;
