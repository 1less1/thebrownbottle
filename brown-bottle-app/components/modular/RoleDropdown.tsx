import React, { useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    FlatList, TouchableWithoutFeedback, StyleProp,
    ViewStyle, TextStyle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";

import { getRole } from "@/routes/role";

import { Role } from '@/types/iRole';


interface DropdownOption {
    key: string;
    value: number | null;
}

interface DropdownProps {
    selectedRoleId: number | null;
    onRoleSelect: (value: number | null, key: string) => void;
    labelText?: string;
    placeholder?: string;
    editable?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const RoleDropdown: React.FC<DropdownProps> = ({
    selectedRoleId,
    onRoleSelect,
    labelText = "Filter:",
    placeholder = "Select a role...",
    editable = true,
    containerStyle,
    buttonStyle,
}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<Role[]>([]);

    const selectedRole = data.find((r) => r.role_id === selectedRoleId);
    const selectedRoleName = selectedRole ? selectedRole.role_name : "";

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getRole();
            setData(response);
        } catch (err) {
            console.error("Failed to fetch roles:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    const handleSelect = (option: DropdownOption) => {
        onRoleSelect(option.value, option.key);
        setVisible(false);
    };


    return (

        <View style={[styles.container, containerStyle]}>

            {/* Filter Label */}
            {labelText ? <Text style={styles.label}>{labelText}</Text> : null}

            {/* Dropdown Button */}
            <TouchableOpacity
                style={[GlobalStyles.dropdownButton, buttonStyle]}
                onPress={() => setVisible(true)}
                disabled={!editable || loading}
            >
                <View style={styles.buttonContent}>
                    <Text style={[styles.optionText, { color: selectedRoleName ? Colors.black : Colors.gray, marginRight: 5 }]}>
                        {selectedRoleName || placeholder}
                    </Text>
                    <Ionicons
                        name={visible ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={Colors.black}
                    />
                </View>
            </TouchableOpacity>

            {/* Modal dropdown */}
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.overlay}>

                        {/* "Dropdown" Modal Content */}
                        <TouchableWithoutFeedback>
                            <View style={styles.dropdown}>
                                {loading ? (
                                    // Loading Text
                                    <Text style={GlobalStyles.loadingText}>Loading...</Text>
                                ) : error ? (
                                    // Error Text
                                    <Text style={GlobalStyles.errorText}>Failed to load roles.</Text>
                                ) : (
                                    // Dropdown List
                                    <FlatList
                                        style={{ flexGrow: 0 }}
                                        // Add placeholder as first item listed with an id=null
                                        data={[{ role_id: null, role_name: placeholder }, ...data]}
                                        keyExtractor={(item) => (item.role_id !== null ? item.role_id.toString() : 'null')}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.option}
                                                onPress={() => handleSelect({ value: item.role_id, key: item.role_name })}
                                            >
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        item.role_id === selectedRoleId && styles.selectedOption,
                                                        item.role_id === null && selectedRoleId !== null && { color: Colors.gray },
                                                    ]}
                                                >
                                                    {item.role_name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />

                                )}
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        marginRight: 8,
        color: Colors.black,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    dropdown: {
        alignSelf: "center",
        minWidth: "55%",
        maxWidth: "80%",
        maxHeight: "65%",
        backgroundColor: Colors.white,
        elevation: 5,
        borderRadius: 10,
        paddingVertical: 8,
    },
    optionText: {
        fontSize: 14,
        color: Colors.black,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    selectedOption: {
        fontWeight: "bold",
        color: Colors.blue,
    },
});

export default RoleDropdown;
