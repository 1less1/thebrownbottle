import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors'; 
import Card from "@/components/Card";
import AltCard from '@/components/AltCard';

interface EventData {
    visible: boolean;
    isShift: boolean;
    date: string | null;
    shiftTime?: string | null;
    role?: string | null;
    events?: string[] | null;
}

interface ShiftProps {
    events: { [key: string]: EventData };
}

const NextShift: React.FC<ShiftProps> = ({ events }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparisons

    // Get the next upcoming shift
    const upcomingShifts = Object.values(events)
        .filter(event => event.isShift && event.visible && event.date) // Ensure event is a shift and visible
        .filter(event => new Date(event.date!) >= today) // Only future dates
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()) // Sort by date
        .slice(0, 1); // Get the next upcoming shift

    if (upcomingShifts.length === 0) {
        return (
            <Card style={styles.container}>
                <Text style={styles.noShiftsText}>No Upcoming Shift...</Text>
            </Card>
        );
    }

    return (
        <Card style={styles.container}>
            {upcomingShifts.map((event, index) => (
                <AltCard key={index} style={styles.shiftCard}>
                    <Text style={styles.dateText}>Date: {event.date}</Text>
                    {event.shiftTime && <Text style={styles.styledText}>Shift Time: {event.shiftTime}</Text>}
                    {event.role && <Text style={styles.styledText}>Role: {event.role}</Text>}
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

export default NextShift;
