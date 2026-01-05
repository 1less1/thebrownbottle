import React, { useState, useEffect } from "react";
import { 
    View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, 
    TouchableWithoutFeedback, StyleProp, ViewStyle, useWindowDimensions 
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";

import { CheckboxOption } from "@/types/iCheckbox";

import ModularButton from "@/components/modular/ModularButton";

interface CheckboxProps<T extends string | number> {
    data: CheckboxOption<T>[];
    selectedData: CheckboxOption<T>[];
    onSelect: (keys: string[], values: T[]) => void; // Return key/value pairs
    labelText?: string;
    usePlaceholder?: boolean;
    placeholderText?: string;
    singularLabel?: string; // ex: "Section"
    pluralLabel?: string;   // ex: "Sections"
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const ModularCheckbox = <T extends string | number>({
    data,
    selectedData,
    onSelect,
    labelText,
    usePlaceholder = false,
    placeholderText = "Select options...",
    singularLabel = "Option",
    pluralLabel = "Options",
    disabled = false,
    containerStyle,
    buttonStyle,
}: CheckboxProps<T>) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;

    const [visible, setVisible] = useState(false);
    const [tempSelected, setTempSelected] = useState<CheckboxOption<T>[]>(selectedData);

    const toggleSelection = (option: CheckboxOption<T>) => {
        setTempSelected((prev) =>
            prev.some((o) => o.value === option.value)
                ? prev.filter((o) => o.value !== option.value)
                : [...prev, option]
        );
    };

    const handleConfirm = () => {
        const confirmedValues = tempSelected.map((o) => o.value);
        const confirmedKeys = tempSelected.map((o) => o.key);
        onSelect(confirmedKeys, confirmedValues);
        setVisible(false);
    };

    const handleSelectAll = () => setTempSelected(data);
    const handleReset = () => setTempSelected([]);

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
                    style={[GlobalStyles.dropdownButton, buttonStyle, disabled && { opacity: 0.5 }]}
                    onPress={() => {
                        setTempSelected(selectedData);
                        setVisible(true);
                    }}
                    disabled={disabled}
                >
                    <View style={styles.buttonContent}>
                        <Text style={[styles.optionText, { color: selectedData.length > 0 ? Colors.black : Colors.gray }]}>
                            {
                                // If there is NO selectedData...
                                selectedData.length === 0
                                    // If usePlacholder = True...
                                    ? usePlaceholder
                                        // Use placholderText if provided or default to "All ___ Items"
                                        ? placeholderText ?? "Select options..."
                                        : `All ${pluralLabel ?? "Items"}`
                                    // If all options in data are selected...
                                    : selectedData.length === data.length
                                        // Display "All ___ Items"
                                        ? `All ${pluralLabel ?? "Items"}`
                                        // If ONE option is selected, display "Item [1]"
                                        // If MORE than one option is selected, display "Items [number]"
                                        : selectedData.length === 1
                                            ? `${singularLabel ?? "Item"} [${selectedData.length}]`
                                            : `${pluralLabel ?? "Items"} [${selectedData.length}]`
                            }
                        </Text>
                        <Ionicons
                            name={visible ? "chevron-up" : "chevron-down"}
                            size={18}
                            color={Colors.black}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Checkbox Modal */}
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                {/* Overlay */}
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.overlay}>

                        {/* Checkbox List */}
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
                                        data={data}
                                        keyExtractor={(item) => item.value?.toString() ?? item.key}
                                        style={{ flexGrow: 0 }}
                                        renderItem={({ item }) => {
                                            const checked = tempSelected.some((o) => o.value === item.value);
                                            return (
                                                <TouchableOpacity
                                                    style={styles.option}
                                                    onPress={() => toggleSelection(item)}
                                                >
                                                    <View style={styles.optionRow}>
                                                        <Ionicons
                                                            name={checked ? "checkbox-outline" : "square-outline"}
                                                            size={20}
                                                            color={checked ? Colors.blue : Colors.gray}
                                                            style={{ marginRight: 4 }}
                                                        />
                                                        {/* Display List Items as "Keys" */}
                                                        <Text style={[styles.optionText, checked && styles.selectedOption]}>
                                                            {item.key}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }}
                                        ListEmptyComponent={ListEmpty}
                                    />
                                )}

                                {/* Button Container */}
                                <View
                                    style={[
                                        GlobalStyles.buttonRowContainer,
                                        {
                                            marginTop: 0,
                                            padding: 20,
                                            flexDirection: isMobile ? 'column' : 'row', // 👈 responsive switch
                                        }
                                    ]}
                                >
                                    <ModularButton
                                        onPress={handleConfirm}
                                        style={[
                                            GlobalStyles.submitButton,
                                            !isMobile && { flex: 1 } // only flex in row mode
                                        ]}
                                        textStyle={{ color: "white" }}
                                        text="Confirm"
                                    />
                                    <ModularButton
                                        onPress={handleSelectAll}
                                        style={[
                                            { backgroundColor: Colors.buttonBlue },
                                            !isMobile && { flex: 1 }
                                        ]}
                                        textStyle={{ color: "white" }}
                                        text="Select All"
                                    />
                                    <ModularButton
                                        onPress={handleReset}
                                        style={!isMobile ? { flex: 1 } : {}}
                                        text=""
                                        textStyle={{ marginRight: 4 }}
                                    >
                                        <Ionicons name="reload-outline" size={20} color={Colors.black} style={{ transform: [{ scaleX: -1 }] }} />
                                    </ModularButton>
                                </View>

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
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    dropdown: {
        alignSelf: "center",
        minWidth: "55%",
        maxWidth: "80%",
        maxHeight: "80%",
        backgroundColor: Colors.white,
        elevation: 5,
        borderRadius: 10,
        paddingTop: 8,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionText: {
        fontSize: 14,
        color: Colors.black,
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

export default ModularCheckbox;
