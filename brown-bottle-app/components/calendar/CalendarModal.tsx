import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import { Shift } from '@/types/iShift';

interface Props {
  visible: boolean,
  shift: Shift,
  onClose: () => void;
}

const CalendarModal: React.FC<Props> = ({ visible, shift, onClose }) => {

  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Date Header */}
      <Text style={GlobalStyles.modalTitle}>Shift</Text>

      {/* Shift Details */}
      <>
        <View style={styles.row}>
          <Text style={[GlobalStyles.semiBoldMediumText, { color: Colors.blue }]}>
            <Text style={GlobalStyles.semiBoldMediumText}>Date: </Text>
            {shift.date}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={GlobalStyles.mediumText}>
            <Text style={GlobalStyles.semiBoldMediumText}>Start Time: </Text>
            {shift.start_time}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={GlobalStyles.mediumText}>
            <Text style={GlobalStyles.semiBoldMediumText}>Section: </Text>
            {shift.section_name}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={GlobalStyles.mediumText}>
            <Text style={GlobalStyles.semiBoldMediumText}>Role: </Text>
            {shift.primary_role_name}
          </Text>
        </View>
      </>

      {/* Close Button */}
      <View style={GlobalStyles.buttonRowContainer}>
        <ModularButton
          text="Close"
          textStyle={{ color: "gray" }}
          style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
          onPress={onClose}
        />
      </View>

    </ModularModal >


  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: "wrap",
    marginBottom: 10
  },
});

export default CalendarModal;
