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
import Toast from "react-native-toast-message";

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import SectionDropdown from "@/components/modular/SectionDropdown";
import { Colors } from '@/constants/Colors';
import { ScheduleEmployee, ShiftDisplay } from '@/types/api';

interface ShiftModalProps {
  visible: boolean;
  onClose: () => void;
  employee: ScheduleEmployee | null;
  date: Date | null;
  shift: ShiftDisplay | any | null;

  onAddShift: (startTime: string, endTime: string, sectionId: number) => Promise<void>;
  onEditShift?: (
    shiftId: number,
    startTime: string,
    endTime: string,
    sectionId: number
  ) => Promise<void>;
  onDeleteShift?: (shiftId: number) => Promise<void>;
}


const ShiftModal: React.FC<ShiftModalProps> = ({
  visible,
  onClose,
  employee,
  date,
  shift,
  onAddShift,
  onEditShift,
  onDeleteShift,
}) => {
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(shift?.section_id ?? null);


  // Initialize values when modal opens
  useEffect(() => {
    if (!visible || !date || employee == null) return;
    if (!date) return;

    if (shift) {
      setStartInput(shift.start_time ?? '');
      setEndInput(shift.end_time ?? '');
      setSelectedSectionId(shift.section_id ?? -1);
    } else {
      setStartInput('');
      setEndInput('');
      setSelectedSectionId(null);
    }


    setError(null);
  }, [visible, shift, date]);

  if (!employee || !date) return null;

  const handleSave = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      if (!startInput || !endInput) {
        setError('Please provide both start and end times.');
        setLoading(false);
        return;
      }

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
      if (!timeRegex.test(startInput) || !timeRegex.test(endInput)) {
        setError('Invalid time format. Use 24-hour time (e.g. 09:00 or 09:00:00).');
        setLoading(false);
        return;
      }

      // ensure end > start
      const start = startInput.slice(0, 5);
      const end = endInput.slice(0, 5);
      if (end <= start) {
        setError('End time must be later than start time.');
        setLoading(false);
        return;
      }


      if (!selectedSectionId) {
        setError("Please select a section.");
        setLoading(false);
        return;
      }

      const sectionToUse = selectedSectionId;

      if (shift?.shift_id && onEditShift) {
        // Edit existing shift (PATCH)
        await onEditShift(shift.shift_id, startInput, endInput, sectionToUse);

        Toast.show({
          type: "success",
          text1: "Shift Updated",
          text2: `${date.toLocaleDateString()} (${startInput}–${endInput})`,
          position: "bottom",
        });


      } else {
        // Add new shift (POST)
        await onAddShift(startInput, endInput, sectionToUse);

        Toast.show({
          type: "success",
          text1: "Shift Created",
          text2: `${date.toLocaleDateString()} (${startInput}–${endInput})`,
          position: "bottom",
        });
      }

      setTimeout(onClose, 300);

    } catch (err: any) {
      console.error('Shift save failed:', err);
      Alert.alert('Error', err.message || 'Failed to save shift.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!shift?.shift_id) {
      Alert.alert("Error", "Shift ID is missing or invalid.");
      return;
    }

    if (!onDeleteShift) {
      Alert.alert("Error", "Delete handler not provided.");
      return;
    }

    // We define the async logic outside the Alert callback
    const confirmDelete = async () => {
      try {
        console.log("Deleting shift:", shift.shift_id);
        await onDeleteShift(shift.shift_id);

        Toast.show({
          type: "success",
          text1: "Shift deleted",
          text2: `Removed for ${employee?.employee_name || "Employee"}`,
          position: "bottom",
        });

        // Delay modal close slightly to let Toast display cleanly
        setTimeout(onClose, 300);
      } catch (err: any) {
        console.error("Shift deletion failed:", err);
        Alert.alert("Error", err.message || "Failed to delete shift.");
      }
    };

    confirmDelete();

  };



  return (
    <ModularModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{shift ? 'Edit Shift' : 'Add Shift'}</Text>
            <Text style={styles.subtitle}>{employee.employee_name}</Text>
            <Text style={styles.date}>{date.toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {/* Input fields */}
        <View style={styles.inputs}>
          <Text style={styles.label}>Start Time (24-hour)</Text>
          <TextInput
            value={startInput}
            onChangeText={setStartInput}
            placeholder="09:00:00"
            placeholderTextColor={Colors.gray}
            style={styles.textInput}
          />

          <Text style={styles.label}>End Time (24-hour)</Text>
          <TextInput
            value={endInput}
            onChangeText={setEndInput}
            placeholder="17:00:00"
            placeholderTextColor={Colors.gray}
            style={styles.textInput}
          />

          <Text style={styles.label}>Section</Text>
          <SectionDropdown
            selectedSectionId={selectedSectionId}
            onSectionSelect={(value, key) => setSelectedSectionId(value)}
            labelText=""
            containerStyle={{ marginBottom: 10 }}
          />


          {error ? <Text style={styles.inputError}>{error}</Text> : null}
        </View>

        {/* Buttons */}
        <View style={styles.actions}>
          <ModularButton
            text={loading ? 'Saving...' : shift ? 'Save Changes' : 'Add Shift'}
            onPress={handleSave}
          />
          {shift && (
            <ModularButton
              text="Delete Shift"
              onPress={handleDelete}
              style={{ backgroundColor: '#e15f45ff' }}
            />
          )}
          <ModularButton text="Cancel" onPress={onClose} style={styles.cancelButton} />
        </View>
      </View>
    </ModularModal>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 2,
  },
  date: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  inputs: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 6,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  inputError: {
    color: '#D9534F',
    marginTop: 6,
    fontSize: 13,
  },
  actions: {
    gap: 12,
  },
  cancelButton: {
    backgroundColor: Colors.borderColor,
    marginTop: 8,
  },
});

export default ShiftModal;
