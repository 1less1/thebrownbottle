import React from "react";
import { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import TimeDropdown from '@/components/modular/dropdown/TimeDropdown';
import SectionDropdown from "@/components/modular/dropdown/SectionDropdown";

import LoadingCircle from "@/components/modular/LoadingCircle";

import { insertShift, updateShift, deleteShift } from '@/routes/shift';
import { ScheduleEmployee, ScheduleShift, Shift, InsertShift, UpdateShift } from '@/types/iShift';
import { buildPatchData } from "@/utils/apiHelpers";
import { convertToSQL24HRTime, isValidTime } from '@/utils/dateTimeHelpers';

import { useConfirm } from '@/hooks/useConfirm';


interface ShiftModalProps {
  visible: boolean;
  shiftData: ScheduleShift | null;
  employeeData: ScheduleEmployee;
  date: string;
  onClose: () => void;
  onUpdate?: () => void;
}

const patchableKeys: (keyof UpdateShift)[] = ["start_time", "section_id"];

const ShiftModal: React.FC<ShiftModalProps> = ({ visible, shiftData, employeeData, date, onClose, onUpdate }) => {

  const { confirm } = useConfirm();

  const [loading, setLoading] = useState(false);

  const [startTime, setStartTime] = useState<string>("");
  const [sectionId, setSectionId] = useState<number | null>(null);

  // Build Form Data
  const formData = useMemo(() => ({
    start_time: startTime,
    section_id: sectionId,
  }), [startTime, sectionId]);

  // Form Validation
  const isValidForm = useMemo(() => (
    startTime.trim().length > 0 && isValidTime(startTime)
    && sectionId !== null
  ), [formData]);  // Only recalculates when formData changes

  // Construct Patch Data (only for existing shifts)
  const patchData = useMemo(() => {
    if (!shiftData) return {};

    // Cast shiftData from ScheduleShift to Shift for comparison
    return buildPatchData(
      shiftData as unknown as Shift,
      formData as unknown as Shift,
      patchableKeys as any
    );
  }, [shiftData, formData]);

  const isDirty = Object.keys(patchData).length > 0;
  const canSave = shiftData ? (isDirty && isValidForm && !loading) : (isValidForm && !loading);

  // Create a fresh form or load data on modal visibility
  useEffect(() => {
    if (visible) {
      setStartTime(shiftData?.start_time ?? "");
      setSectionId(shiftData?.section_id ?? null);
    }
  }, [visible, shiftData]);


  // Delete Shift Logic
  const handleDelete = async () => {
    if (!shiftData) return;

    // Confirmation Popup
    const ok = await confirm(
      'Confirm Deletion',
      'Are you sure you want to delete this shift? This action cannot be undone.'
    );
    if (!ok) return;

    try {
      setLoading(true);

      await deleteShift(shiftData.shift_id);
      alert("Shift successfully deleted!");
      onUpdate?.();
      onClose();
    } catch (error: any) {
      alert("Failed to delete shift: " + error.message);
    } finally {
      setLoading(false);
    }

  };


  // Add/Update Shift Logic
  const handleSave = async () => {
    if (!canSave) return;

    // Confirmation Popup
    const title = shiftData ? 'Confirm Update' : 'Confirm Shift';
    const message = `Are you sure you want to ${shiftData ? 'update' : 'add'} this shift?`;
    const ok = await confirm(title, message);
    if (!ok) return;

    try {
      setLoading(true);

      if (shiftData) {
        // Construct Final Patch Data
        const finalPatchData = { ...patchData };

        // Format start_time if it was changed
        if (finalPatchData.start_time) {
          finalPatchData.start_time = convertToSQL24HRTime(finalPatchData.start_time);
        }

        await updateShift(shiftData.shift_id, finalPatchData as UpdateShift);
        alert("Shift successfully updated!");
      } else {
        // Construct Insert Payload
        const insertPayload = {
          employee_id: employeeData.employee_id,
          date: date,
          section_id: sectionId!, // canSave and isValidForm ensures sectionId is not null here!
          start_time: convertToSQL24HRTime(startTime),
        };

        await insertShift(insertPayload as InsertShift);
        alert("Shift successfully added!");
      }
      onUpdate?.();
      onClose();
    } catch (error: any) {
      alert("Failed to save shift: " + error.message);
      console.log("Failed to save shift: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Header */}
      <View>
        <Text style={GlobalStyles.modalTitle}>{shiftData ? 'Edit Shift' : 'Add Shift'}</Text>
        <Text style={GlobalStyles.semiBoldMediumText}>{employeeData.full_name}</Text>
        <Text style={GlobalStyles.mediumAltText}>{(date)}</Text>
      </View>

      {!employeeData ? (
        <LoadingCircle size="small" />
      ) : (
        <View style={styles.formContainer}>

          {/* Input fields */}
          <Text style={GlobalStyles.inputLabelText}>Start Time</Text>
          <TimeDropdown
            time={startTime}
            onTimeChange={(value) => setStartTime(value)}
            disabled={loading}
          />

          <Text style={GlobalStyles.inputLabelText}>Section</Text>
          <SectionDropdown
            selectedSection={sectionId}
            onSectionSelect={(value) => setSectionId(value as number)}
            labelText=""
            containerStyle={GlobalStyles.dropdownButtonWrapper}
            disabled={loading}
          />

          {/* Buttons */}
          <View style={GlobalStyles.buttonRowContainer}>
            <ModularButton
              textStyle={{ color: 'white' }}
              style={[GlobalStyles.submitButton, { flexGrow: 1 }]}
              text={shiftData ? "Update" : "Add"}
              onPress={handleSave}
              enabled={canSave}
            />

            {shiftData && (
              // Delete Button
              <ModularButton
                text="Remove"
                textStyle={{ color: Colors.red }}
                style={[GlobalStyles.borderButton, styles.deleteButton]}
                onPress={handleDelete}
                enabled={!loading}
              />
            )}

            <ModularButton
              text="Cancel"
              textStyle={{ color: 'gray' }}
              style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
              onPress={onClose}
            />
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
  deleteButton: {
    flexGrow: 1,
    backgroundColor: Colors.bgRed,
    borderColor: Colors.borderRed,
    alignItems: "center"
  },
});


export default ShiftModal;
