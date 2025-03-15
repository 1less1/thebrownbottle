import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

import AltCard from '@/components/AltCard';

interface CalendarModalProps {
  visible: boolean;
  date: string | null;
  shiftTime?: string | null;
  events: string[];
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ visible, date, shiftTime, events, onClose }) => {

  return (

    <Modal visible={visible} transparent animationType="fade">

        <View style={styles.overlay}>

            <AltCard style={{ backgroundColor: Colors.white, width: '85%', padding: 16, margin: 0}}>



                {/* Date Header */}
                <Text style={styles.dateText}>{date}</Text>

                {/* Shift Time (conditionally render) */}
                {shiftTime && (
                <Text style={styles.styledText}>
                    Shift Time: {shiftTime}
                </Text>
                )}

                {/* Events List */}
                {events.length > 0 ? (
                events.map((event, index) => (
                    <Text key={index} style={styles.styledText}>
                    • {event}
                    </Text>
                ))

                ) : (

                    <Text style={styles.noEventsText}>No events for this day</Text>
                )}

                {/* Close Button */}
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>


            </AltCard>

      </View>
      
    </Modal>

  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkBrown,
    marginBottom: 8,
  },
  styledText:{
    fontSize: 16,
    fontWeight: '400',
    color: Colors.black,
    marginTop: 6
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.gray,
    fontStyle: 'italic',
    marginTop: 6,
  },
  closeButton: {
    width: '45%',
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: Colors.darkBrown,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default CalendarModal;