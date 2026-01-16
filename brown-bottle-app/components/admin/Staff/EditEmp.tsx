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

import { yesNoDropdownOptions } from '@/types/iDropdown';

import { Employee, UpdateEmployee } from "@/types/iEmployee";
import { updateEmployee } from '@/routes/employee';
import { buildPatchData } from '@/utils/apiHelpers';
import { isValidEmail, isValidPhone, formatPhone, formatWage } from '@/utils/formHelpers';

import { useConfirm } from '@/hooks/useConfirm';


interface EditEmpProps {
  visible: boolean;
  onClose: () => void;
  empData: Employee;
  onUpdate?: () => void;
}

const adminDropdownOptions = yesNoDropdownOptions;

const isActiveDropdownOptions = yesNoDropdownOptions;

// List of keys that can be included in a PATCH request
const patchableKeys: (keyof UpdateEmployee)[] = [
  "first_name", "last_name", "email", "phone_number", "wage",
  "admin", "primary_role", "secondary_role", "tertiary_role", "is_active"
];

const EditEmp: React.FC<EditEmpProps> = ({ visible, onClose, empData, onUpdate }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const { confirm } = useConfirm();

  const [loading, setLoading] = useState(false);

  const [originalEmpData, setOriginalEmpData] = useState<Employee | null>(null);

  const [employeeId, setEmployeeId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [wage, setWage] = useState("");
  const [admin, setAdmin] = useState(0); // Default admin=0 (False)
  const [primaryRole, setPrimaryRole] = useState<number | null>(null);
  const [secondaryRole, setSecondaryRole] = useState<number | null>(null);
  const [tertiaryRole, setTertiaryRole] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<number>(1); // Default is_active=1 (True)

  // Build Form Data
  const formData = useMemo(() => ({
    employee_id: employeeId,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim(),
    phone_number: phoneNumber.trim(),
    wage: wage.trim(),
    admin: admin,
    primary_role: primaryRole,
    secondary_role: secondaryRole,
    tertiary_role: tertiaryRole,
    is_active: isActive,
  }), [firstName, lastName, email, phoneNumber, wage, admin, primaryRole, secondaryRole, tertiaryRole, isActive, employeeId]);

  // Form Validation
  const isValidForm = useMemo(() => (
    formData.first_name!.length > 0 &&
    formData.last_name!.length > 0 &&
    isValidEmail(formData.email!) &&
    isValidPhone(formData.phone_number!) &&
    formData.wage!.length > 0 &&
    formData.primary_role != null &&
    (isActive === 0 || isActive === 1)
  ), [formData]); // Only recalculates when formData changes

  // Construct data that has been changed
  const patchData = useMemo(() => {
    if (!originalEmpData) return {};

    return buildPatchData(originalEmpData, formData, patchableKeys);
  }, [originalEmpData, formData]);

  const isDirty = Object.keys(patchData).length > 0;
  const canUpdate = isDirty && isValidForm && !loading;

  // Create a fresh form on modal visibility and empData change
  useEffect(() => {
    if (visible && empData) {
      setOriginalEmpData(empData);

      setEmployeeId(empData.employee_id);
      setFirstName(empData.first_name);
      setLastName(empData.last_name);
      setEmail(empData.email);
      setPhoneNumber(empData.phone_number);
      setWage(empData.wage.toString());
      setAdmin(empData.admin);
      setPrimaryRole(empData.primary_role);
      setSecondaryRole(empData.secondary_role);
      setTertiaryRole(empData.tertiary_role);
      setIsActive(empData.is_active);
    }
  }, [visible, empData]);


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

      // Construct Final Patch Data
      const finalPatchData = { ...patchData };

      await updateEmployee(employeeId, finalPatchData as UpdateEmployee);
      alert("Employee successfully updated!");
      onUpdate?.();
      onClose();
    } catch (error: any) {
      alert("Failed to update employee: " + error.message);
      console.log("Failed to update employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (

    <ModularModal visible={visible} onClose={onClose} scroll={false}>

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
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Last Name</Text>
              <TextInput
                style={GlobalStyles.input}
                value={lastName}
                onChangeText={setLastName}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Email</Text>
              <TextInput
                style={GlobalStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@domain.com"
                placeholderTextColor={Colors.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Phone</Text>
              <TextInput
                style={GlobalStyles.input}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(formatPhone(text))}
                placeholder="XXX-XXX-XXXX"
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Wage</Text>
              <TextInput
                style={GlobalStyles.input}
                value={wage}
                onChangeText={((text) => setWage(formatWage(text)))}
                placeholder="00.00"
                placeholderTextColor={Colors.gray}
                keyboardType="decimal-pad"
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Admin</Text>
              <ModularDropdown
                data={adminDropdownOptions}
                selectedValue={admin}
                onSelect={(value) => setAdmin(value as number)}
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Primary Role</Text>
              <RoleDropdown
                selectedRole={primaryRole}
                onRoleSelect={setPrimaryRole}
                placeholderText="None"
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Secondary Role</Text>
              <RoleDropdown
                selectedRole={secondaryRole}
                onRoleSelect={setSecondaryRole}
                placeholderText="None"
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Tertiary Role</Text>
              <RoleDropdown
                selectedRole={tertiaryRole}
                onRoleSelect={setTertiaryRole}
                placeholderText="None"
                containerStyle={styles.dropdownButton}
              />

              <Text style={[GlobalStyles.mediumText, { marginVertical: 6 }]}>Active</Text>
              <ModularDropdown
                data={isActiveDropdownOptions}
                selectedValue={isActive}
                onSelect={(value) => setIsActive(value as number)}
                usePlaceholder={false}
                containerStyle={styles.dropdownButton}
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
              onPress={onClose}
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
});

export default EditEmp;
