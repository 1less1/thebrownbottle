import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

interface CalendarModalProps {
  visible: boolean,
  date: string | null;
  startTime: string | undefined;
  role: string | undefined;
  section: string | undefined;
  onClose: () => void;
}



const CalendarModal: React.FC<CalendarModalProps> = ({ visible, date, startTime, role, section, onClose }) => {

  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Date Header */}
      <Text style={GlobalStyles.modalTitle}>{date}</Text>

      <>
        {startTime && (
          <View style={styles.row}>
            <Text style={GlobalStyles.semiBoldMediumText}>Start Time: </Text>
            <Text style={GlobalStyles.mediumText}>
              {startTime}
            </Text>
          </View>
        )}
        {section && (
          <View style={styles.row}>
            <Text style={GlobalStyles.semiBoldMediumText}>Section: </Text>
            <Text style={GlobalStyles.mediumText}>
              {section}
            </Text>
          </View>
        )}
        {role && (
          <View style={styles.row}>
            <Text style={GlobalStyles.semiBoldMediumText}>Role: </Text>
            <Text style={GlobalStyles.mediumText}>
              {role}
            </Text>
          </View>
        )}
      </>

      {/* Close Button */}
      <View style={GlobalStyles.buttonRowContainer}>
        <ModularButton
          text="Close"
          textStyle={{ color: "gray" }}
          style={[GlobalStyles.cancelButton, { flex: 1 }]}
          onPress={onClose}
        />
      </View>

    </ModularModal >


  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
});

export default CalendarModal;
