import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import { useSession } from '@/utils/SessionContext';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import { insertTimeOffRequest } from '@/routes/time_off_request';
import CalendarWidget from '@/components/calendar/CalendarWidget';

import { formatDateWithYear } from '@/utils/dateTimeHelpers';

import { InsertTimeOffRequest } from '@/types/iTimeOff';
import { useConfirm } from '@/hooks/useConfirm';


interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

const SubmitTimeOff: React.FC<ModalProps> = ({ visible, onClose, onSubmitted }) => {
  const { user } = useSession();
  const { confirm } = useConfirm();

  const [loading, setLoading] = useState(false);

  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const MAX_CHARS = 400;

  const dateDisplay = (() => {
    if (!startDate) return "";

    // If only start selected (no end yet)
    if (!endDate) return `${formatDateWithYear(startDate)} →`;

    // If start and end are the same day
    if (startDate === endDate) return formatDateWithYear(startDate);

    // Normal range
    return `${formatDateWithYear(startDate)} → ${formatDateWithYear(endDate)}`;
  })();


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

    if (loading) return;

    try {
      setLoading(true);

      const payload: InsertTimeOffRequest = {
        employee_id: user.employee_id,
        reason: reason,
        start_date: startDate,
        end_date: endDate
      };

      await insertTimeOffRequest(payload);
      alert('Time off request submitted successfully!');
      onSubmitted?.();
      resetForm();
      onClose();
    } catch (error: any) {
      alert("Failed to submit time off request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Modal Title */}
      <Text style={GlobalStyles.modalTitle}>New Time Off Request</Text>

      {/* Date Range Picker */}
      <View style={styles.calendarContainer}>
        <CalendarWidget
          mode="picker"
          pickerType="range"
          showShifts={false}
          onSelectRange={({ startDate, endDate }) => {
            setStartDate(startDate);
            setEndDate(endDate);
          }}
        />
      </View>

      {/* Selected Range Display */}
      <View style={{ flexDirection: "row", gap: 10, marginVertical: 15 }}>
        <View style={styles.dateContainer}>
          <Text style={GlobalStyles.text}>
            Selected:{" "}
            <Text style={[GlobalStyles.semiBoldText, { color: Colors.purple }]}>
              {/* No Start Date Selected */}
              {!startDate && ""}

              {/* Start and End are different (Range) */}
              {startDate && startDate !== endDate && (
                <>
                  {formatDateWithYear(startDate).replace(/ /g, '\u00A0')}
                  {" → "}
                  {endDate
                    ? formatDateWithYear(endDate).replace(/ /g, '\u00A0')
                    : "..."}
                </>
              )}

              {/* Start and End are the same (Single Day) */}
              {startDate && startDate === endDate && (
                formatDateWithYear(startDate).replace(/ /g, '\u00A0')
              )}
            </Text>
          </Text>
        </View>
      </View>


      {/* Reason Field
      <Text style={[GlobalStyles.boldMediumText, { marginBottom: 10 }]}>
        Reason for Time Off
      </Text>
      */}
      <TextInput
        placeholder="Enter A Reason"
        placeholderTextColor={Colors.gray}
        value={reason}
        onChangeText={(text) => {
          if (text.length <= MAX_CHARS) {
            setReason(text);
          }
        }}
        multiline
        numberOfLines={3}
        style={[GlobalStyles.input, { marginBottom: 5 }]}
      />
      <Text style={{ color: Colors.gray }}>
        {reason.length}/{MAX_CHARS}
      </Text>


      {/* Buttons */}
      <View style={GlobalStyles.buttonRowContainer}>
        <ModularButton
          text="Submit"
          textStyle={{ color: 'white' }}
          style={[GlobalStyles.submitButton, { flex: 1 }]}
          onPress={handleSubmit}
        />
        <ModularButton
          text="Cancel"
          textStyle={{ color: 'gray' }}
          style={[GlobalStyles.cancelButton, { flex: 1 }]}
          onPress={handleClose}
        />
      </View>

    </ModularModal>

  );
};

export default SubmitTimeOff;

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
  calendarContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.borderColor,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  calendarButton: {
    flexShrink: 1,
    minWidth: 200,
    paddingHorizontal: 15,
  },
});
