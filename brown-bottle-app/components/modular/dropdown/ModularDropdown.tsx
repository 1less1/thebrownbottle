import React, { useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, Modal, FlatList,
    TouchableWithoutFeedback, StyleProp, ViewStyle, useWindowDimensions
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";

import { DropdownOption } from "@/types/iDropdown";

interface DropdownProps<T extends number | string | null> {
    data: DropdownOption<T>[];
    selectedValue: T | null;
    onSelect: (value: T | null) => void;
    labelText?: string;
    usePlaceholder?: boolean;
    placeholderText?: string;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const ModularDropdown = <T extends string | number | null>({
    data,
    selectedValue,
    onSelect,
    labelText,
    usePlaceholder = true,
    placeholderText = "Select an option...",
    disabled = false,
    containerStyle,
    buttonStyle,
}: DropdownProps<T>) => {

    const [visible, setVisible] = useState(false);

    const dropdownOptions: DropdownOption<T>[] = usePlaceholder
        ? [{ key: placeholderText, value: null as T }, ...data]
        : data;

    const selectedOption = dropdownOptions.find(opt => opt.value === selectedValue);
    const displayLabel = selectedOption ? selectedOption.key : placeholderText;

    const handleSelect = (option: DropdownOption<T>) => {
        onSelect(option.value);
        setVisible(false);
    };

    const ListEmpty = (
        <View style={styles.singleOptionRow}>
            <Text style={GlobalStyles.text}>No data found!</Text>
        </View>
    );

    return (
        <>

            {/* Button */}
            <View style={[styles.container, containerStyle]}>
                {/* Optional Label */}
                {labelText ? <Text style={styles.label}>{labelText}</Text> : null}

                {/* Dropdown Button */}
                <TouchableOpacity
                    style={[GlobalStyles.dropdownButton, buttonStyle, disabled && { opacity: 0.6 }]}
                    onPress={() => setVisible(true)}
                    disabled={disabled}
                >
                    <View style={styles.buttonContent}>
                        <Text style={[styles.optionText, { color: selectedValue === null ? Colors.gray : Colors.black, marginRight: 5 }]}>
                            {displayLabel}
                        </Text>
                        <Ionicons
                            name={visible ? "chevron-up" : "chevron-down"}
                            size={18}
                            color={Colors.black}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Dropdown Modal */}
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                {/* Overlay */}
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.overlay}>

                        {/* Dropdown List */}
                        <TouchableWithoutFeedback>
                            <View style={styles.dropdown}>
                                {data.length === 0 ? (
                                    // Error state
                                    <View style={styles.singleOptionRow}>
                                        <Text style={GlobalStyles.errorText}>
                                            Failed to fetch!
                                        </Text>
                                    </View>
                                ) : (
                                    // Success state
                                    <FlatList
                                        data={dropdownOptions}
                                        keyExtractor={(item, idx) => item.value !== null ? item.value.toString() : `null-${idx}`}
                                        style={{ flexGrow: 0 }}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.option}
                                                onPress={() => handleSelect(item)}
                                            >
                                                {/* Display Dropdown options as "Keys" */}
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        item.value === selectedValue && styles.selectedOption,
                                                        item.value === null && item.value !== selectedValue && { color: Colors.gray },
                                                    ]}
                                                >
                                                    {item.key}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        ListEmptyComponent={ListEmpty}
                                    />
                                )}
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </>

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
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    dropdown: {
        alignSelf: "center",
        width: "55%",
        maxWidth: 350,
        maxHeight: "80%",
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
    singleOptionRow: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignSelf: "center",
        justifyContent: "center",
    },
});

export default ModularDropdown