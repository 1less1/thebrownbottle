import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import AltCard from '@/components/modular/AltCard';

interface CalendarModalProps {
  visible: boolean,
  date: string | null;
  startTime: string | undefined;
  role: string | undefined;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ visible, date, startTime, role, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">

      <View style={styles.overlay}>

        <AltCard style={{ backgroundColor: Colors.white, width: '75%', padding: 16, margin: 0 }}>
          {/* Date Header */}
          <Text style={styles.dateText}>{date}</Text>

          <>
            {startTime && (
              <Text style={styles.styledText}>
                Start Time: {startTime}
              </Text>
            )}
            {role && (
              <Text style={styles.styledText}>
                Role: {role}
              </Text>
            )}
            
          </>

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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkBrown,
    marginBottom: 8,
  },
  styledText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.black,
    marginTop: 6,
  },
  noEventsText: {
    fontSize: 14,
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
