import React, { useState, useEffect, useMemo } from 'react';
import { useWindowDimensions, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';
import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';

import { yesNoDropdownOptions } from '@/types/iDropdown';

import { Employee, InsertEmployee } from "@/types/iEmployee";
import { insertEmployee } from '@/routes/employee';
import { isValidEmail, isValidPhone, formatPhone, formatWage } from '@/utils/formHelpers';

interface AddEmpProps {
    onInsert?: () => void;
}

const adminDropdownOptions = yesNoDropdownOptions;

const AddEmp: React.FC<AddEmpProps> = ({ onInsert }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [wage, setWage] = useState("");
    const [admin, setAdmin] = useState(0);
    const [primaryRole, setPrimaryRole] = useState<number | null>(null);
    const [secondaryRole, setSecondaryRole] = useState<number | null>(null);
    const [tertiaryRole, setTertiaryRole] = useState<number | null>(null);

    // Build Form Data
    const formData = useMemo(() => ({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        wage: wage.trim(),
        admin: admin,
        primary_role: primaryRole,
        secondary_role: secondaryRole,
        tertiary_role: tertiaryRole,
    }), [firstName, lastName, email, phoneNumber, wage, admin, primaryRole, secondaryRole, tertiaryRole]);

    // Form Validation
    const isValidForm = useMemo(() => (
        formData.first_name!.length > 0 &&
        formData.last_name!.length > 0 &&
        isValidEmail(formData.email!) &&
        isValidPhone(formData.phone_number!) &&
        formData.wage!.length > 0 &&
        formData.primary_role != null
    ), [formData]); // Only recalculates when formData changes

    // Create a fresh form on modal visibility change
    useEffect(() => {
        if (modalVisible) {
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
    }, [modalVisible]);

    // Insert Employee Logic
    const handleInsert = async () => {
        if (loading || !isValidForm) return;

        try {
            setLoading(true);

            // Construct Insert Payload
            const insertPayload = { ...formData };

            await insertEmployee(formData as InsertEmployee);
            alert("Employee successfully added!");
            onInsert?.();
            closeModal();
        } catch (error: any) {
            alert("Failed to add employee: " + error.message);
            console.log("Failed to add employee: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    return (

        <View style={styles.container}>

            {/* Clickable Tile */}
            <TouchableOpacity onPress={openModal} style={styles.addButton}>
                <Ionicons name="person-add" size={30} color="black" style={styles.icon} />
                <Text style={[GlobalStyles.boldText, styles.iconText]}>Add Employee</Text>
            </TouchableOpacity>

            {/* Add Emp Modal */}
            <ModularModal visible={modalVisible} onClose={closeModal} scroll={false}>

                {/* Header */}
                <Text style={GlobalStyles.modalTitle}>Add Employee</Text>

                {/* Employee Form (Scrollable)*/}
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

                    </ScrollView>

                </View>

                {/* Buttons */}
                <View style={GlobalStyles.buttonRowContainer}>
                    {/* Add Button */}
                    <ModularButton
                        text="Add"
                        textStyle={{ color: 'white' }}
                        style={[GlobalStyles.submitButton, { flexGrow: 1 }]}
                        onPress={handleInsert}
                        enabled={isValidForm && !loading}
                    />

                    {/* Cancel Button */}
                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
                        onPress={closeModal}
                    />
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
        height: 120,
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
    dropdownButton: {
        minWidth: 0,
        alignSelf: "flex-start",
    },
});

export default AddEmp;
