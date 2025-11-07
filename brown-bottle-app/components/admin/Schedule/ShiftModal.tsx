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
import { useConfirm } from '@/hooks/useConfirm';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import SectionDropdown from "@/components/modular/SectionDropdown";
import { Colors } from '@/constants/Colors';
import { ScheduleEmployee, ShiftDisplay } from '@/types/iApi';
import { to24HourFormat, to12HourFormat } from '@/utils/dateTimeHelpers';  // ✅ conversion helpers

interface ShiftModalProps {
  visible: boolean;
  onClose: () => void;
  employee: ScheduleEmployee | null;
  date: Date | null;
  shift: ShiftDisplay | any | null;
  onAddShift: (startTime: string, endTime: string, sectionId: number) => Promise<void>;
  onEditShift?: (shiftId: number, startTime: string, endTime: string, sectionId: number) => Promise<void>;
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

  useEffect(() => {
    if (!visible || !date || !employee) return;

    if (shift) {
      // convert existing 24h times → 12h display
      setStartInput(shift.start_time ? to12HourFormat(shift.start_time) : '');
      setEndInput(shift.end_time ? to12HourFormat(shift.end_time) : '');
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

      // Convert user 12h input → 24h before validation and submit
      const start24 = to24HourFormat(startInput);
      const end24 = to24HourFormat(endInput);

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(start24) || !timeRegex.test(end24)) {
        setError('Invalid time format. Use "3:00 PM" or "09:00 AM".');
        setLoading(false);
        return;
      }

      // ensure end > start
      if (end24 <= start24) {
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
        // Edit existing shift
        await onEditShift(shift.shift_id, start24, end24, sectionToUse);
        Toast.show({
          type: "success",
          text1: "Shift Updated",
          text2: `${date.toLocaleDateString()} (${startInput}–${endInput})`,
          position: "bottom",
        });
      } else {
        // Add new shift
        await onAddShift(start24, end24, sectionToUse);
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

  const handleDelete = async () => {
    if (!shift?.shift_id || !onDeleteShift) {
      Alert.alert("Error", "Shift ID or delete handler missing.");
      return;
    }

    const { confirm } = useConfirm();
    const ok = await confirm(
      "Confirm Deletion",
      `Delete this shift for ${employee.employee_name}?`
    );

    if (!ok) return;

    try {
      await onDeleteShift(shift.shift_id);
      Toast.show({
        type: "success",
        text1: "Shift Deleted",
        text2: `Removed for ${employee.employee_name}`,
        position: "bottom",
      });
      setTimeout(onClose, 300);
    } catch (err: any) {
      console.error("Shift deletion failed:", err);
      Alert.alert("Error", err.message || "Failed to delete shift.");
    }
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

        {/* Inputs */}
        <View style={styles.inputs}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            value={startInput}
            onChangeText={setStartInput}
            placeholder="e.g. 9:00 AM"
            placeholderTextColor={Colors.gray}
            style={styles.textInput}
          />

          <Text style={styles.label}>End Time</Text>
          <TextInput
            value={endInput}
            onChangeText={setEndInput}
            placeholder="e.g. 5:00 PM"
            placeholderTextColor={Colors.gray}
            style={styles.textInput}
          />

          <Text style={styles.label}>Section</Text>
          <SectionDropdown
            selectedSectionId={selectedSectionId}
            onSectionSelect={(value) => setSelectedSectionId(value)}
            labelText=""
            containerStyle={{ marginBottom: 10, backgroundColor: Colors.inputBG }}
          />

          {error ? <Text style={styles.inputError}>{error}</Text> : null}
        </View>

        {/* Actions */}
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
  title: { fontSize: 20, fontWeight: '700', color: Colors.black },
  subtitle: { fontSize: 16, color: Colors.black, marginTop: 2 },
  date: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  closeButton: { padding: 4 },
  inputs: { gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.gray, marginBottom: 6 },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.inputBG,
  },
  inputError: { color: '#D9534F', marginTop: 6, fontSize: 13 },
  actions: { gap: 12 },
  cancelButton: { backgroundColor: Colors.borderColor, marginTop: 8 },
});

export default ShiftModal;
