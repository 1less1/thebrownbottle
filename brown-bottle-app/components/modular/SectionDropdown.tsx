import React, { useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    FlatList, TouchableWithoutFeedback, StyleProp,
    ViewStyle, TextStyle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";

import { getSection } from "@/utils/api/section";

import { Section } from '@/types/api';


interface DropdownOption {
    key: string;
    value: number | null;
}

interface DropdownProps {
    selectedSectionId: number | null;
    onSectionSelect: (value: number | null, key: string) => void;
    labelText?: string;
    placeholder?: string;
    editable?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const SectionDropdown: React.FC<DropdownProps> = ({
    selectedSectionId,
    onSectionSelect,
    labelText = "Filter:",
    placeholder = "Select a section...",
    editable = true,
    containerStyle,
    buttonStyle,
}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<Section[]>([]);

    const selectedSection = data.find((r) => r.section_id === selectedSectionId);
    const selectedSectionName = selectedSection ? selectedSection.section_name : "";

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getSection();
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
        onSectionSelect(option.value, option.key);
        setVisible(false);
    };


    return (

        <View style={[styles.container, containerStyle]}>

            {/* Filter Label */}
            {labelText ? <Text style={styles.label}>{labelText}</Text> : null}

            {/* Dropdown Button */}
            <TouchableOpacity
                style={[styles.button, buttonStyle]}
                onPress={() => setVisible(true)}
                disabled={!editable || loading}
            >
                <View style={styles.buttonContent}>
                    <Text style={[styles.optionText, { color: selectedSectionName ? Colors.black : Colors.gray, marginRight: 5 }]}>
                        {selectedSectionName || placeholder}
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
                                        data={[{ section_id: null, section_name: placeholder }, ...data]}
                                        keyExtractor={(item) => (item.section_id !== null ? item.section_id.toString() : 'null')}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.option}
                                                onPress={() => handleSelect({ value: item.section_id, key: item.section_name })}
                                            >
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        item.section_id === selectedSectionId && styles.selectedOption,
                                                        item.section_id === null && selectedSectionId !== null && { color: Colors.gray },
                                                    ]}
                                                >
                                                    {item.section_name}
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
    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
        borderRadius: 6,
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

export default SectionDropdown;
