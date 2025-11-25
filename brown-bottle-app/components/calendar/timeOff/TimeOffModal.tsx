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

import { TimeOffModalProps } from '@/types/iTimeOff';

const TimeOffModal: React.FC<TimeOffModalProps> = ({ visible, onClose, onSubmitted }) => {
  const { user } = useSession(); //  globally available user
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
      await insertTimeOffRequest(
        Number(user.employee_id),
        reason,
        startDate,
        endDate
      );
      alert('Time Off Request Submitted Successfully!');
      resetForm();

      if (onSubmitted) {
        onSubmitted(); // ensures refetch finishes before closing
      }
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
      <Text style={GlobalStyles.modalTitle}>Make a Time Off Request</Text>

      {/* Date Pickers */}

      {/* Start Date */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 15 }}>
        <ModularButton
          text="Choose Start Date"
          textStyle={{ color: 'black' }}
          style={[styles.calendarButton]}
          onPress={() => setStartDateVisible(true)}
        />

        <View style={styles.dateContainer}>
          <Text style={GlobalStyles.text}>Date: </Text>
          <Text style={[GlobalStyles.text, { color: Colors.blue }]}>
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 15 }}>
        <ModularButton
          text="Choose End Date"
          textStyle={{ color: 'black' }}
          style={[styles.calendarButton]}
          onPress={() => setEndDateVisible(true)}
        />

        <View style={styles.dateContainer}>
          <Text style={GlobalStyles.text}>Date: </Text>
          <Text style={[GlobalStyles.text, { color: Colors.blue }]}>
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
        Reason For Time Off
      </Text>
      <TextInput
        placeholder="Enter A Reason"
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
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    backgroundColor: 'white',
    borderColor: Colors.darkTan,
    borderWidth: 1,
    flexShrink: 1,
    paddingHorizontal: 15,
  },
});

export default TimeOffModal;
