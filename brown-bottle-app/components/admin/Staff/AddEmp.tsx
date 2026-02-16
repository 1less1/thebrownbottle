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

interface AddEmployeeForm extends Omit<InsertEmployee, 'primary_role'> {
    primary_role: number | null;
}

const defaultFormData: AddEmployeeForm = {
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
};

const AddEmp: React.FC<AddEmpProps> = ({ onInsert }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => {
        setFormData(defaultFormData);
        setModalVisible(false);
    };

    const [formData, setFormData] = useState<AddEmployeeForm>(defaultFormData);

    // Generic Input Handler
    const handleChange = (field: keyof AddEmployeeForm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    
    // Form Validation
    const isValidForm = useMemo(() => (
        (formData.first_name?.trim().length ?? 0) > 0 &&
        (formData.last_name?.trim().length ?? 0) > 0 &&
        isValidEmail(formData.email ?? "") &&
        isValidPhone(formData.phone_number ?? "") &&
        (formData.wage?.toString().length ?? 0) > 0 &&
        formData.primary_role !== null
    ), [formData]);


    // Insert Employee Logic
    const handleInsert = async () => {
        if (loading || !isValidForm) return;

        try {
            setLoading(true);

            const payload = formData as unknown as InsertEmployee;

            await insertEmployee(payload);
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
