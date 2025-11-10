import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import RoleDropdown from '@/components/modular/RoleDropdown';
import ModularDropdown from '@/components/modular/ModularDropdown';

import { Employee } from "@/types/iApi";
import { updateEmployee } from '@/utils/api/employee';
import { isValidEmail, isValidPhone, formatPhone, formatWage, buildPatchData } from '@/utils/Helper';


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

const isActiveDropdownOptions = [
  { value: 1, key: "Yes" },
  { value: 0, key: "No" },
]


const EditEmp: React.FC<EditEmpProps> = ({ visible, onClose, empData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const [originalEmpData, setOriginalEmpData] = useState<Employee | null>(null);

  const [employeeId, setEmployeeId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [wage, setWage] = useState("");
  const [admin, setAdmin] = useState(0);
  const [primaryRole, setPrimaryRole] = useState<number | null>(null);
  const [secondaryRole, setSecondaryRole] = useState<number | null>(null);
  const [tertiaryRole, setTertiaryRole] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<number>(1); // Default is_active=1 (True)

  // Map local variables to an Employee object
  const buildFormData = (): Employee => ({
    employee_id: employeeId,
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone_number: phoneNumber,
    wage: wage,
    admin: admin,
    primary_role: primaryRole,
    secondary_role: secondaryRole,
    tertiary_role: tertiaryRole,
    is_active: isActive,
  });

  // Set form data on empData input change
  useEffect(() => {
    if (empData) {
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
  }, [empData]);

  // Reset form on visbility change
  useEffect(() => {
    if (!visible) {
      setEdit(false);
      setOriginalEmpData(null);
    }
  }, [visible]);

  const handleEdit = () => setEdit(!edit);

  // List of keys that can be included in a PATCH request
  const patchableKeys: (keyof Employee)[] = [
    "first_name", "last_name", "email", "phone_number", "wage",
    "admin", "primary_role", "secondary_role", "tertiary_role", "is_active"
  ];

  // Update Employee Logic
  const handleUpdate = async () => {
    if (!originalEmpData) return;

    const formData = buildFormData();

    // Builds patchData by comparing originalEmpData and formData
    // Returns a record of fields that have been changed
    const patchData = buildPatchData(originalEmpData, formData, patchableKeys);
    console.log("Patch Data:", patchData);

    if (Object.keys(patchData).length === 0) {
      alert("No changes detected!");
      return;
    }

    setLoading(true);

    try {

      // Validate Required Fields
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim() || !wage.trim()) {
        alert("Please fill out all required fields!");
        setLoading(false);
        return;
      }

      if (primaryRole == null) {
        alert("Please assign a primary role!");
        setLoading(false);
        return;
      }

      // Validate Phone Number
      if (!isValidPhone(phoneNumber)) {
        alert("Please enter a valid phone number in the format XXX-XXX-XXXX.");
        setLoading(false);
        return;
      }

      // Validate Email
      if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      await updateEmployee(originalEmpData.employee_id, patchData);
      alert("Employee successfully updated!");
      onUpdate?.();
      onClose();
    } catch (error: any) {
      alert("Unable to update Employee: " + error.message);
    } finally {
      setLoading(false);
    }

  };


  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Header */}
      <View style={GlobalStyles.headerContainer}>
        <Text style={GlobalStyles.modalTitle}>Employee Details</Text>
        <TouchableOpacity onPress={onClose} style={{ marginRight: 8 }}>
          <Ionicons name="close" size={28} color={Colors.black} />
        </TouchableOpacity>
      </View>


      {/* Employee Form */}
      {originalEmpData ? (
        <View style={styles.formContainer}>
          <Text style={GlobalStyles.mediumText}>First Name</Text>
          <TextInput
            style={GlobalStyles.input}
            value={firstName}
            onChangeText={setFirstName}
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Last Name</Text>
          <TextInput
            style={GlobalStyles.input}
            value={lastName}
            onChangeText={setLastName}
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Email</Text>
          <TextInput
            style={GlobalStyles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@domain.com"
            placeholderTextColor={Colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Phone</Text>
          <TextInput
            style={GlobalStyles.input}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(formatPhone(text))}
            placeholder="XXX-XXX-XXXX"
            placeholderTextColor={Colors.gray}
            keyboardType="phone-pad"
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Wage</Text>
          <TextInput
            style={GlobalStyles.input}
            value={wage}
            onChangeText={((text) => setWage(formatWage(text)))}
            placeholder="00.00"
            placeholderTextColor={Colors.gray}
            keyboardType="decimal-pad"
            editable={edit}
          />

          <Text style={GlobalStyles.mediumText}>Admin</Text>
          <ModularDropdown
            options={adminDropdownOptions}
            selectedValue={admin}
            onSelect={(value) => setAdmin(value as number)}
            labelText=""
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          <Text style={GlobalStyles.mediumText}>Primary Role</Text>
          <RoleDropdown
            selectedRoleId={primaryRole}
            onRoleSelect={setPrimaryRole}
            labelText=""
            placeholder="None"
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          <Text style={GlobalStyles.mediumText}>Secondary Role</Text>
          <RoleDropdown
            selectedRoleId={secondaryRole}
            onRoleSelect={setSecondaryRole}
            labelText=""
            placeholder="None"
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          <Text style={GlobalStyles.mediumText}>Tertiary Role</Text>
          <RoleDropdown
            selectedRoleId={tertiaryRole}
            onRoleSelect={setTertiaryRole}
            labelText=""
            placeholder="None"
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          <Text style={GlobalStyles.mediumText}>Active</Text>
          <ModularDropdown
            options={isActiveDropdownOptions}
            selectedValue={isActive}
            onSelect={(value) => setIsActive(value as number)}
            labelText=""
            usePlaceholder={false}
            editable={edit}
            containerStyle={styles.dropdownButton}
          />

          {/* Buttons */}
          <View style={styles.buttonRowContainer}>
            {edit ? (
              <ModularButton
                text="Update"
                textStyle={{ color: 'white' }}
                style={GlobalStyles.submitButton}
                onPress={handleUpdate}
                enabled={!loading}
              />
            ) : (
              <ModularButton
                text="Edit"
                onPress={handleEdit}
              />
            )}
            <ModularButton
              text="Cancel"
              textStyle={{ color: 'gray' }}
              style={GlobalStyles.cancelButton}
              onPress={onClose}
            />
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
    minWidth: 0,
    alignSelf: "flex-start",
  },
});

export default EditEmp;
