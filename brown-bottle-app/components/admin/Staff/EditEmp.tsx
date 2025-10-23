import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import { Employee, EmployeeForm } from "@/types/api";
import RoleDropdown from '@/components/modular/RoleDropdown';

import ModularDropdown from '@/components/modular/ModularDropdown';

import { updateEmployee } from '@/utils/api/employee';

interface EditEmpProps {
  visible: boolean;
  onClose: () => void;
  empData: Employee | null;
  onUpdate?: () => void;
}

const adminDropdownOptions = [
  { value: 1, key: "Yes" },
  { value: 0, key: "No" },
];

// Only for updates / patching
type EmployeePATCH = {
  [k in keyof Employee]?: Employee[k] | null;
};


const EditEmp: React.FC<EditEmpProps> = ({ visible, onClose, empData, onUpdate }) => {

  const [loading, setLoading] = useState(false);

  const [edit, setEdit] = useState(false);

  const [originalEmpData, setOriginalEmpData] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Employee | null>(null);


  const handleEdit = () => setEdit(!edit);

  const handleInputChange = (key: keyof Employee, value: string | number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [key]: value,
    });
  };



  const resetForm = () => {
    setFormData(null);
    setOriginalEmpData(null);
    setEdit(false);
  };

  const loadForm = () => {
    if (empData) {
      setFormData(empData);
      setOriginalEmpData(empData); // keep a copy to compare changes later
    }

  };

  // Sync local state when empData changes
  useEffect(() => {
    loadForm();
  }, [empData]);



  // Clear Form on Modal Close
  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);


  const handleUpdate = async () => {
    if (!formData || !originalEmpData) return;

    // EmployeePATCH allows optional fields + nulls
    const updates: EmployeePATCH = {};

    // Map over keys of Employee for full type safety
    (Object.keys(formData) as (keyof Employee)[]).forEach((key) => {
      const newValue = formData[key];
      const oldValue = originalEmpData[key];

      // Only include changed fields
      if (newValue !== oldValue) {
        updates[key] = newValue; // TypeScript is happy
      }
    });

    // If no changes, just close modal
    if (Object.keys(updates).length === 0) {
      return onClose();
    }

    setLoading(true);
    try {
      await updateEmployee(formData.employee_id, updates);
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };





  return (
    <ModularModal visible={visible} onClose={onClose}>
      <Text style={GlobalStyles.modalTitle}>Employee Details</Text>

      {empData ? (
        <View style={styles.formContainer}>
          <Text style={GlobalStyles.mediumText}>First Name</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData?.first_name}
            onChangeText={(userInput) => handleInputChange('first_name', userInput)}
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Last Name</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData?.last_name}
            onChangeText={((userInput) => handleInputChange('last_name', userInput))}
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Email</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData?.email}
            onChangeText={(userInput) => handleInputChange('email', userInput)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Phone</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData?.phone_number}
            onChangeText={(userInput) => handleInputChange('phone_number', userInput)}
            keyboardType="phone-pad"
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Wage</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData?.wage?.toString() || '0.00'}
            onChangeText={(userInput) => handleInputChange('wage', parseFloat(userInput) || 0)}
            keyboardType="numeric"
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Admin</Text>
          <ModularDropdown
            options={adminDropdownOptions}
            selectedValue={formData?.admin || 0}
            onSelect={(value) => handleInputChange('admin', value as number)}
            labelText=""
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          <Text style={GlobalStyles.mediumText}>Primary Role</Text>
          <RoleDropdown
            selectedRoleId={formData?.primary_role || null}
            onRoleSelect={(value) => handleInputChange('primary_role', value as number)}
            labelText=""
            placeholder="None"
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          <Text style={GlobalStyles.mediumText}>Secondary Role</Text>
          <RoleDropdown
            selectedRoleId={formData?.secondary_role || null}
            onRoleSelect={(value) => handleInputChange('secondary_role', value as number)}
            labelText=""
            placeholder="None"
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          <Text style={GlobalStyles.mediumText}>Tertiary Role</Text>
          <RoleDropdown
            selectedRoleId={formData?.tertiary_role || null}
            onRoleSelect={(value) => handleInputChange('tertiary_role', value as number)}
            labelText=""
            placeholder="None"
            editable={edit}
            containerStyle={styles.dropdownButton}
          />




          <View style={styles.buttonRowContainer}>

            {edit ? (
              <ModularButton
                text="Update"
                textStyle={{ color: 'white' }}
                style={GlobalStyles.submitButton}
                onPress={handleUpdate} />
            ) : (
              <ModularButton
                text="Edit"
                onPress={handleEdit} />
            )
            }

            <ModularButton
              text="Cancel"
              textStyle={{ color: 'gray' }}
              style={GlobalStyles.cancelButton}
              onPress={onClose} />
          </View>
        </View>
      ) : (
        <Text style={GlobalStyles.loadingText}>Loading employee data...</Text>
      )}
    </ModularModal>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
    marginTop: 10,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  dropdownButton: {
    minWidth: 0,      // let it shrink as much as content allows
    alignSelf: "flex-start", // size to content rather than container
  },
});

export default EditEmp;
