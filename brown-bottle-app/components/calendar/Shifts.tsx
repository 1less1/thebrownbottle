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
  // Get the first two events from the events map
  const firstTwoEvents = Object.keys(events)
    .slice(0, 2) // Take only the first two keys
    .map(key => events[key]); // Map to event data

  return (

    <Card style={styles.container}>

        {/* Loop over the first two events */}
        {firstTwoEvents.map((event, index) => (

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
});

export default Shifts;
