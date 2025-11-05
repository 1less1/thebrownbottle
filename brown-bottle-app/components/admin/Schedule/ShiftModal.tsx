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
}


const ShiftModal: React.FC<ShiftModalProps> = ({
  visible,
  onClose,
  employee,
  date,
  shift,
}) => {
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number>(shift?.section_id ?? -1);


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
      setSelectedSectionId(-1);
    }


    setError(null);
  }, [visible, shift, date]);


  const handleDelete = () => {
    return;
  }

  const handleSave = () => {
    return;
  }

  if (!employee || !date) return null;



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
            onSectionSelect={(value) => setSelectedSectionId(value as number)}
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
