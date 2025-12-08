import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import { useSession } from '@/utils/SessionContext';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import { insertTimeOffRequest } from '@/routes/time_off_request';
import CalendarWidget from '../CalendarWidget';

import { formatDateWithYear } from '@/utils/dateTimeHelpers';

import { InsertTimeOffRequest } from '@/types/iTimeOff';


interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

const SubmitTimeOff: React.FC<ModalProps> = ({ visible, onClose, onSubmitted }) => {
  const { user } = useSession();

  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);

  const resetForm = () => {
    setReason('');
    setStartDate('');
    setEndDate('');
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('User not found. Please log in again.');
      return;
    }

    if (!reason.trim() || !startDate || !endDate) {
      alert('Please fill in all fields!');
      return;
    }

    try {

      const payload: InsertTimeOffRequest = {
        employee_id: user.employee_id,
        reason: reason,
        start_date: startDate,
        end_date: endDate
      };

      await insertTimeOffRequest(payload);
      alert('Time off request submitted successfully!');
      resetForm();
      onSubmitted?.();
      onClose();
    } catch (error) {
      console.error('Error submitting time off request:', error);
      alert('Failed to submit time off request. Please try again.');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModularModal visible={visible} onClose={onClose}>
      <Text style={GlobalStyles.modalTitle}>New Time Off Request</Text>

      {/* Date Pickers */}

      {/* Start Date */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 5, marginBottom: 15 }}>
        <ModularButton
          text="Choose Start Date"
          style={{ flexGrow: 1, flexShrink: 1, minWidth: 200, flexBasis: '48%', backgroundColor: Colors.bgPurple, borderWidth: 1, borderColor: Colors.borderPurple }}
          textStyle={{ color: Colors.purple }}
          onPress={() => setStartDateVisible(true)}
        />

        <View style={styles.dateContainer}>
          <Text style={GlobalStyles.text}>Date: </Text>
          <Text style={[GlobalStyles.semiBoldText, { color: Colors.purple}]}>
            {startDate ? formatDateWithYear(startDate) : ""}
          </Text>
        </View>
      </View>

      <ModularModal visible={startDateVisible} onClose={() => setStartDateVisible(false)}>
        <CalendarWidget
          mode="picker"
          showShifts={false}
          initialDate={startDate}
          onSelectDate={({ date }) => {
            setStartDate(date);
            setStartDateVisible(false);
          }}
        />

        <ModularButton style={GlobalStyles.cancelButton} text='Cancel' onPress={() => setStartDateVisible(false)} />
      </ModularModal>

      {/* End Date */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 5, marginBottom: 15 }}>
        <ModularButton
          text="Choose End Date"
          style={{ flexGrow: 1, flexShrink: 1, flexBasis: '48%', minWidth: 200, backgroundColor: Colors.bgPurple, borderWidth: 1, borderColor: Colors.borderPurple }}
          textStyle={{ color: Colors.purple }}
          onPress={() => setEndDateVisible(true)}
        />

        <View style={styles.dateContainer}>
          <Text style={GlobalStyles.text}>Date: </Text>
          <Text style={[GlobalStyles.semiBoldText, { color: Colors.purple }]}>
            {endDate ? formatDateWithYear(endDate) : ""}
          </Text>
        </View>
      </View>

      <ModularModal visible={endDateVisible} onClose={() => setEndDateVisible(false)}>
        <CalendarWidget
          mode="picker"
          showShifts={false}
          initialDate={startDate}
          onSelectDate={({ date }) => {
            setEndDate(date);
            setEndDateVisible(false);
          }}
        />

        <ModularButton style={GlobalStyles.cancelButton} text='Cancel' onPress={() => setEndDateVisible(false)} />
      </ModularModal>


      {/* Reason Field */}
      <Text
        style={[GlobalStyles.boldMediumText, { marginBottom: 10 }]}
      >
        Reason for Time Off
      </Text>
      <TextInput
        placeholder="Enter A Reason"
        placeholderTextColor={Colors.gray}
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
        style={[GlobalStyles.input, { marginBottom: 15 }]}
      />

      {/* Buttons */}
      <View style={styles.buttonRowContainer}>
        <ModularButton
          text="Submit"
          textStyle={{ color: 'white' }}
          style={GlobalStyles.submitButton}
          onPress={handleSubmit}
        />
        <ModularButton
          text="Cancel"
          textStyle={{ color: 'gray' }}
          style={GlobalStyles.cancelButton}
          onPress={handleClose}
        />
      </View>
    </ModularModal>
  );
};

const styles = StyleSheet.create({
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  dateContainer: {
    flexShrink: 1,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    minWidth: 200,
    flexBasis: '48%',
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: Colors.borderColor,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  calendarButton: {
    flexShrink: 1,
    minWidth: 200,
    paddingHorizontal: 15,
  },
});

export default SubmitTimeOff;
