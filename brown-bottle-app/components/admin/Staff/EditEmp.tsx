import React, { useState, useEffect, useMemo } from 'react';
import { useWindowDimensions, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';
import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';

import LoadingCircle from '@/components/modular/LoadingCircle';

import AvailabilityModal from '@/components/admin/Staff/AvailabilityModal';

import { yesNoDropdownOptions } from '@/types/iDropdown';

import { Employee, UpdateEmployee } from "@/types/iEmployee";
import { updateEmployee } from '@/routes/employee';
import { isValidEmail, isValidPhone, formatPhone, formatWage } from '@/utils/formHelpers';

import { useConfirm } from '@/hooks/useConfirm';


interface EditEmpProps {
  visible: boolean;
  onClose: () => void;
  empData: Employee;
  onUpdate?: () => void;
}

interface UpdateEmployeeForm extends Omit<UpdateEmployee, 'primary_role'> {
  primary_role: number | null;
}

const defaultFormData: UpdateEmployeeForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  wage: "",
  admin: 0,
  primary_role: null,
  secondary_role: null,
  tertiary_role: null,
  is_active: 1 // Default to active (1 = True)
}

const EditEmp: React.FC<EditEmpProps> = ({ visible, onClose, empData, onUpdate }) => {
  if (!empData) return;

  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const { confirm } = useConfirm();

  const [loading, setLoading] = useState(false);

  const [originalEmpData, setOriginalEmpData] = useState<UpdateEmployeeForm | null>(null);
  const [formData, setFormData] = useState<UpdateEmployeeForm>(defaultFormData);

  // Generic Input Handler
  const handleChange = (field: keyof UpdateEmployeeForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Availability Modal
  const [availModalVisible, setAvailModalVisible] = useState(false);

  const handleClose = () => {
    setFormData(defaultFormData);
    setOriginalEmpData(null);
    onClose();
  };


  // Initialize formData and originalEmpData
  useEffect(() => {
    if (visible && empData) {
      const inputValues: UpdateEmployeeForm = {
        first_name: empData.first_name,
        last_name: empData.last_name,
        email: empData.email,
        phone_number: empData.phone_number,
        wage: empData.wage.toString(),
        admin: empData.admin,
        primary_role: empData.primary_role,
        secondary_role: empData.secondary_role,
        tertiary_role: empData.tertiary_role,
        is_active: empData.is_active,
      };
      setFormData(inputValues);
      setOriginalEmpData(inputValues);
    }
  }, [visible, empData]);

  // Form Validation
  const isValidForm = useMemo(() => (
    (formData.first_name?.trim().length ?? 0) > 0 &&
    (formData.last_name?.trim().length ?? 0) > 0 &&
    isValidEmail(formData.email ?? "") &&
    isValidPhone(formData.phone_number ?? "") &&
    (formData.wage?.toString().length ?? 0) > 0 &&
    formData.primary_role !== null &&
    (formData.is_active === 0 || formData.is_active === 1)
  ), [formData]);

  // Form Changed?
  const isDirty = useMemo(() => {
    if (!originalEmpData || !formData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalEmpData);
  }, [formData, originalEmpData]);

  const canUpdate = isDirty && isValidForm && !loading;


  // Update Employee Logic
  const handleUpdate = async () => {
    if (!canUpdate) return;

    // Confirmation Popup
    const ok = await confirm(
      "Confirm Update",
      `Are you sure you want to update employee details?`
    );
    if (!ok) return;

    try {
      setLoading(true);

      const payload = formData as unknown as UpdateEmployee

      await updateEmployee(empData.employee_id, payload);
      alert("Employee successfully updated!");
      onUpdate?.();
      handleClose();
    } catch (error: any) {
      alert("Failed to update employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (

    <ModularModal visible={visible} onClose={handleClose} scroll={false}>

      {/* Header */}
      <Text style={GlobalStyles.modalTitle}>Employee Details</Text>

      {/* Employee Form */}
      {!originalEmpData ? (
        <LoadingCircle size="small" />
      ) : (
        <>
          <View style={[styles.formContainer, { height: HEIGHT * 0.42 }]}>

            <ScrollView>

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>First Name</Text>
              <TextInput
                style={GlobalStyles.input}
                value={formData.first_name}
                onChangeText={(val) => handleChange('first_name', val)}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Last Name</Text>
              <TextInput
                style={GlobalStyles.input}
                value={formData.last_name}
                onChangeText={(val) => handleChange('last_name', val)}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Email</Text>
              <TextInput
                style={GlobalStyles.input}
                value={formData.email}
                onChangeText={(val) => handleChange('email', val)}
                placeholder="email@domain.com"
                placeholderTextColor={Colors.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Phone</Text>
              <TextInput
                style={GlobalStyles.input}
                value={formData.phone_number}
                onChangeText={(val) => handleChange('phone_number', formatPhone(val))}
                placeholder="XXX-XXX-XXXX"
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Wage</Text>
              <TextInput
                style={GlobalStyles.input}
                value={formData.wage}
                onChangeText={(val) => handleChange('wage', formatWage(val))}
                placeholder="00.00"
                placeholderTextColor={Colors.gray}
                keyboardType="decimal-pad"
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Admin</Text>
              <ModularDropdown
                data={yesNoDropdownOptions}
                selectedValue={formData.admin}
                onSelect={(val) => handleChange('admin', val as number)}
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Primary Role</Text>
              <RoleDropdown
                selectedRole={formData.primary_role}
                onRoleSelect={(val) => handleChange('primary_role', val)}
                placeholderText="None"
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Secondary Role</Text>
              <RoleDropdown
                selectedRole={formData.secondary_role}
                onRoleSelect={(val) => handleChange('secondary_role', val)}
                placeholderText="None"
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Tertiary Role</Text>
              <RoleDropdown
                selectedRole={formData.tertiary_role}
                onRoleSelect={(val) => handleChange('tertiary_role', val)}
                placeholderText="None"
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Active</Text>
              <ModularDropdown
                data={yesNoDropdownOptions}
                selectedValue={formData.is_active}
                onSelect={(val) => handleChange('is_active', val)}
                usePlaceholder={false}
                containerStyle={styles.dropdownButton}
              />


              {/* Availability Button + Modal */}
              <ModularButton
                text="Availability"
                textStyle={{ color: Colors.buttonBlue }}
                style={[GlobalStyles.borderButton, styles.availabilityButton]}
                onPress={() => setAvailModalVisible(true)}
                enabled={true}
              />

              <AvailabilityModal
                visible={availModalVisible}
                onClose={() => setAvailModalVisible(false)}
                employeeId={empData.employee_id}
              />


            </ScrollView>

          </View>


          {/* Buttons */}
          <View style={GlobalStyles.buttonRowContainer}>
            {/* Update Button */}
            <ModularButton
              text="Update"
              textStyle={{ color: 'white' }}
              style={[GlobalStyles.submitButton, { flexGrow: 1 }]}
              onPress={handleUpdate}
              enabled={canUpdate}
            />

            {/* Cancel Button */}
            <ModularButton
              text="Cancel"
              textStyle={{ color: 'gray' }}
              style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
              onPress={handleClose}
            />
          </View>

        </>
      )}

    </ModularModal>

  );

};

const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
    marginTop: 10,
  },
  dropdownButton: {
    minWidth: 0,
    alignSelf: "flex-start",
  },
  availabilityButton: {
    marginVertical: 12,
    minWidth: 0,
    alignSelf: "flex-start",
    backgroundColor: Colors.bgBlue,
    borderColor: Colors.borderBlue,
    alignItems: "center"
  },
});

export default EditEmp;
