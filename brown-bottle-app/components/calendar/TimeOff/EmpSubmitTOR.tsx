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

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const SubmitTimeOff: React.FC<Props> = ({ visible, onClose, onSubmit }) => {

  const { user } = useSession();
  const { confirm } = useConfirm();

  const [loading, setLoading] = useState(false);

  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const MAX_CHARS = 400;

  const resetForm = () => {
    setReason('');
    setStartDate('');
    setEndDate('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Form Validation
  const isValidForm =
    reason.trim().length > 0 &&
    startDate.trim().length > 0 &&
    endDate.trim().length > 0;

  const handleSubmit = async () => {
    if (!user || loading || !startDate || !endDate) return;

    const ok = await confirm(
      'Confirm Submission',
      `Submit Time Off Request?`
    );
    if (!ok) return;

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
      onSubmit?.();
      resetForm();
      onClose();
    } catch (error: any) {
      alert("Failed to submit time off request!");
      console.log("Failed to submit time off request:", error.message);
    } finally {
      setLoading(false);
    }
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
      <View style={styles.dateContainer}>
        <Text style={[GlobalStyles.semiBoldText, { color: Colors.purple }]}>
          {/* No Start Date Selected */}
          {!startDate && "No Date Selected"}

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
      </View>

      {/* Reason */}
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
          style={[GlobalStyles.submitButton, { flexGrow: 1 }]}
          onPress={handleSubmit}
          enabled={!loading && isValidForm}
        />
        <ModularButton
          text="Cancel"
          textStyle={{ color: 'gray' }}
          style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
          onPress={handleClose}
        />
      </View>

    </ModularModal>

  );
};

export default SubmitTimeOff;

const styles = StyleSheet.create({
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
  dateContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    backgroundColor: Colors.bgPurple,
    borderColor: Colors.borderPurple,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 15
  },
});
