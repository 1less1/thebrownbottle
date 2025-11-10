import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import SectionDropdown from "@/components/modular/SectionDropdown";


import { insertShift, updateShift, deleteShift } from '@/utils/api/shift';
import { ScheduleEmployee, ScheduleShift, Shift } from '@/types/api';
import { formatSQLTime, formatTime } from '@/utils/Helper';


interface ShiftModalProps {
  visible: boolean;
  onClose: () => void;
  shiftData: ScheduleShift | null;
  employeeData: ScheduleEmployee | null;
  date: string;
  onUpdate?: () => void;
}


const ShiftModal: React.FC<ShiftModalProps> = ({ visible, onClose, shiftData, employeeData, date, onUpdate }) => {

  const [loading, setLoading] = useState(false);

  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [sectionId, setSectionId] = useState<number | null>(null);


  // Initialize values when modal opens
  useEffect(() => {
    if (visible) {
      setEmployeeId(employeeData?.employee_id ?? null)
      setShiftId(shiftData?.shift_id ?? null)
      setStartTime(shiftData?.start_time ?? "");
      setEndTime(shiftData?.end_time ?? "");
      setSectionId(shiftData?.section_id ?? null);
    }
  }, [visible, shiftData, employeeData]);


  const buildFormData = (): Partial<Shift> => ({
    employee_id: employeeData?.employee_id,
    section_id: sectionId ?? shiftData?.section_id,
    date: date,   // YYYY-MM-DD
    start_time: formatSQLTime(startTime), // HH:MM
    end_time: formatSQLTime(endTime),  // HH:MM
  });


  const handleDelete = async () => {

    if (!shiftData) {
      return;
    }

    setLoading(true);

    try {
      await deleteShift(shiftData.shift_id);
      alert("Shift successfully deleted!");
      onUpdate?.();
      onClose();
    } catch (error: any) {
      alert("Unable to delete shift: " + error.message);
    } finally {
      setLoading(false);
    }

  };

  const handleSave = async () => {
    setLoading(true);

    const formData = buildFormData();

    try {

      // Validate Required Fields
      if (!startTime.trim()) {
        alert("Please assign a start time.");
        setLoading(false);
        return;
      }

      if (!endTime.trim()) {
        alert("Please assign a end time.");
        setLoading(false);
        return;
      }

      if (sectionId == null) {
        alert("Please assign a section.")
        setLoading(false)
        return;
      }

      if (shiftData) {
        if (shiftId !== null) {
          await updateShift(shiftId, formData);
        }
        alert("Shift successfully updated!");
      } else {
        await insertShift(formData);
        alert("Shift successfully added!");
      }
      onUpdate?.();
      onClose();
    } catch (error: any) {
      console.log("Unable to save shift: " + error.message);
      alert("Unable to save shift! Make sure shift details have been properly changed or try again later.")
    } finally {
      setLoading(false);
    }

  };


  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Header */}
      <View style={GlobalStyles.headerContainer}>
        <View>
          <Text style={GlobalStyles.modalTitle}>{shiftData ? 'Edit Shift' : 'Add Shift'}</Text>
          <Text style={GlobalStyles.mediumText}>{employeeData?.full_name ?? ""}</Text>
          <Text style={GlobalStyles.mediumAltText}>{(date)}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={{ marginRight: 8 }}>
          <Ionicons name="close" size={28} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={GlobalStyles.loadingText}>Loading shift data...</Text>
      ) : (
        <View style={styles.formContainer}>

          {/* Input fields */}
          <Text style={GlobalStyles.inputLabelText}>Start Time</Text>
          <TextInput
            style={GlobalStyles.input}
            value={startTime}
            onChangeText={(text) => setStartTime(text)} // raw input
            onBlur={() => setStartTime(formatTime(startTime))} // format on blur
            placeholder="HH:MM AM/PM"
            placeholderTextColor={Colors.gray}
            editable={!loading}
          />

          <Text style={GlobalStyles.inputLabelText}>End Time</Text>
          <TextInput
            style={GlobalStyles.input}
            value={endTime}
            onChangeText={(text) => setEndTime(text)} // raw input
            onBlur={() => setEndTime(formatTime(endTime))} // format on blur
            placeholder="HH:MM AM/PM"
            placeholderTextColor={Colors.gray}
            editable={!loading}
          />

          <Text style={GlobalStyles.inputLabelText}>Section</Text>
          <SectionDropdown
            selectedSectionId={sectionId}
            onSectionSelect={(value) => setSectionId(value as number)}
            labelText=""
            containerStyle={{ marginBottom: 10 }}
          />

          {/* Buttons */}
          <View style={styles.buttonRowContainer}>
            <ModularButton
              textStyle={{ color: 'white' }}
              style={GlobalStyles.submitButton}
              text={shiftData ? 'Save Changes' : 'Add Shift'}
              onPress={handleSave}
            />

            {shiftData && (
              <ModularButton
                text="Delete Shift"
                onPress={handleDelete}
                style={GlobalStyles.deleteButton}
              />
            )}
          </View>

        </View>
      )}

    </ModularModal>

  );

};


const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
});


export default ShiftModal;
