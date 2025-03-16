import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors'; 
import Card from "@/components/Card";
import AltCard from '../AltCard';

interface EventData {
    visible: boolean;
    isShift: boolean;
    date: string | null;
    shiftTime?: string | null;
    role?: string | null;
    events?: string[] | null;
}

interface ShiftsProps {
    events: { [key: string]: EventData };
}

const Shifts: React.FC<ShiftsProps> = ({ events }) => {

    // Today's Date
    const today = new Date();

    // Get the next two Upcoming Shifts
    const upcomingShifts = Object.values(events)
        .filter(event => event.isShift && event.date) // Only valid shifts with a date
        .filter(event => new Date(event.date!) >= today) // Only future dates
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()) // Sort by ascending date
        .slice(0, 2); // Get the next two shifts

    // Handle no upcoming shifts case
    if (upcomingShifts.length === 0) {
        return (
        <Card style={styles.container}>
            <Text style={styles.noShiftsText}>No Upcoming Shifts...</Text>
        </Card>
        );
    }


    return (

        <Card style={styles.container}>

            {/* Display the next two Upcoming Shifts */}
            {upcomingShifts.map((event, index) => (

            event.isShift && event.visible && (

                <AltCard key={index} style={styles.shiftCard}>

                    <Text style={styles.dateText}>Date: {event.date}</Text>
                    {event.shiftTime && <Text style={styles.styledText}>Shift Time: {event.shiftTime}</Text>}
                    {event.role && <Text style={styles.styledText}>Role: {event.role}</Text>}

                </AltCard>

            )
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
