import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import RoleDropdown from '@/components/modular/RoleDropdown';
import ModularDropdown from '@/components/modular/ModularDropdown';

import { Employee } from "@/types/iEmployee";
import { insertEmployee } from '@/routes/employee';
import { isValidEmail, isValidPhone, formatPhone, formatWage } from '@/utils/formHelpers';

interface AddEmpProps {
    onInsert?: () => void;
}

const adminDropdownOptions = [
    { value: 1, key: "Yes" },
    { value: 0, key: "No" },
];

const AddEmp: React.FC<AddEmpProps> = ({ onInsert }) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [wage, setWage] = useState("");
    const [admin, setAdmin] = useState(0);
    const [primaryRole, setPrimaryRole] = useState<number | null>(null);
    const [secondaryRole, setSecondaryRole] = useState<number | null>(null);
    const [tertiaryRole, setTertiaryRole] = useState<number | null>(null);

    const buildFormData = (): Partial<Employee> => ({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        wage: wage,
        admin: admin,
        primary_role: primaryRole,
        secondary_role: secondaryRole,
        tertiary_role: tertiaryRole,
    });

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    const resetForm = () => {
        setLoading(false);

        // Reset Employee Form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setWage("");
        setAdmin(0);
        setPrimaryRole(null);
        setSecondaryRole(null);
        setTertiaryRole(null);
    }

    const onClose = () => {
        resetForm();
        toggleModal();
    };

    // Insert Employee Logic
    const handleInsert = async () => {
        const formData = buildFormData();

        setLoading(true);

        try {

            // Validate Required Fields
            if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim() || !wage.trim()) {
                alert("Please fill out all required fields!");
                setLoading(false);
                return;
            }

            if (primaryRole == null) {
                alert("Please assign a primary role.");
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

            await insertEmployee(formData);
            alert("Employee successfully added!");
            onInsert?.();
            onClose();
        } catch (error: any) {
            alert("Unable to add Employee: " + error.message);
        } finally {
            setLoading(false);
        }

    };


    return (

        <View style={styles.container}>

            {/* Clickable Content */}
            <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
                <Ionicons name="person-add" size={30} color="black" style={styles.icon} />
                <Text style={[GlobalStyles.boldText, styles.iconText]}>Add Employee</Text>
            </TouchableOpacity>

            {/* Add Emp Modal */}
            <ModularModal visible={modalVisible} onClose={toggleModal}>

                {/* Header */}
                <View style={GlobalStyles.headerContainer}>
                    <Text style={GlobalStyles.modalTitle}>Employee Details</Text>
                    <TouchableOpacity onPress={onClose} style={{ marginRight: 8 }}>
                        <Ionicons name="close" size={28} color={Colors.black} />
                    </TouchableOpacity>
                </View>

                {/* Employee Form */}
                <View style={styles.formContainer}>
                    <Text style={GlobalStyles.mediumText}>First Name</Text>
                    <TextInput
                        style={GlobalStyles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <Text style={GlobalStyles.mediumText}>Last Name</Text>
                    <TextInput
                        style={GlobalStyles.input}
                        value={lastName}
                        onChangeText={setLastName}
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
                    />

                    <Text style={GlobalStyles.mediumText}>Phone</Text>
                    <TextInput
                        style={GlobalStyles.input}
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(formatPhone(text))}
                        placeholder="XXX-XXX-XXXX"
                        placeholderTextColor={Colors.gray}
                        keyboardType="phone-pad"
                    />

                    <Text style={GlobalStyles.mediumText}>Wage</Text>
                    <TextInput
                        style={GlobalStyles.input}
                        value={wage}
                        onChangeText={((text) => setWage(formatWage(text)))}
                        placeholder="00.00"
                        placeholderTextColor={Colors.gray}
                        keyboardType="decimal-pad"
                    />

                    <Text style={GlobalStyles.mediumText}>Admin</Text>
                    <ModularDropdown
                        options={adminDropdownOptions}
                        selectedValue={admin}
                        onSelect={(value) => setAdmin(value as number)}
                        labelText=""
                        containerStyle={styles.dropdownButton}
                    />

                    <Text style={GlobalStyles.mediumText}>Primary Role</Text>
                    <RoleDropdown
                        selectedRoleId={primaryRole}
                        onRoleSelect={setPrimaryRole}
                        labelText=""
                        placeholder="None"
                        containerStyle={styles.dropdownButton}
                    />

                    <Text style={GlobalStyles.mediumText}>Secondary Role</Text>
                    <RoleDropdown
                        selectedRoleId={secondaryRole}
                        onRoleSelect={setSecondaryRole}
                        labelText=""
                        placeholder="None"
                        containerStyle={styles.dropdownButton}
                    />

                    <Text style={GlobalStyles.mediumText}>Tertiary Role</Text>
                    <RoleDropdown
                        selectedRoleId={tertiaryRole}
                        onRoleSelect={setTertiaryRole}
                        labelText=""
                        placeholder="None"
                        containerStyle={styles.dropdownButton}
                    />

                    {/* Buttons */}
                    <View style={styles.buttonRowContainer}>
                        <ModularButton
                            text="Add"
                            textStyle={{ color: 'white' }}
                            style={GlobalStyles.submitButton}
                            onPress={handleInsert}
                            enabled={!loading}
                        />
                        <ModularButton
                            text="Reset "
                            onPress={resetForm}
                            enabled={!loading}
                        />
                        <ModularButton
                            text="Cancel"
                            textStyle={{ color: 'gray' }}
                            style={GlobalStyles.cancelButton}
                            onPress={onClose}
                        />
                    </View>


                </View>

            </ModularModal>

        </View>

    );

};

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'column',
        padding: 15,
        height: 150,
        justifyContent: 'center',
    },
    icon: {
        marginBottom: 8,
    },
    iconText: {
        textAlign: 'center',
        flexWrap: 'wrap',
    },
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

export default AddEmp;
