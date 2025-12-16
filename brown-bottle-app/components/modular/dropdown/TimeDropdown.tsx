import React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";

import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";

import { breakUpTime } from "@/utils/dateTimeHelpers";

interface TimeDropdownProps {
    time: string;
    onTimeChange: (time: string) => void;
    disabled?: boolean;
}

const hourOptions = [
    { key: '01', value: '01' },
    { key: '02', value: '02' },
    { key: '03', value: '03' },
    { key: '04', value: '04' },
    { key: '05', value: '05' },
    { key: '06', value: '06' },
    { key: '07', value: '07' },
    { key: '08', value: '08' },
    { key: '09', value: '09' },
    { key: '10', value: '10' },
    { key: '11', value: '11' },
    { key: '12', value: '12' },
];

const minuteOptions = [
    { key: '00', value: '00' },
    { key: '15', value: '15' },
    { key: '30', value: '30' },
    { key: '45', value: '45' },
];

const meridiemOptions = [
    { key: 'AM', value: 'AM' },
    { key: 'PM', value: 'PM' },
];

const TimeDropdown: React.FC<TimeDropdownProps> = ({ time, onTimeChange, disabled = false}) => {
    const { hours, minutes, meridiem } = breakUpTime(time || "");

    return (

        <View style={styles.rowContainer}>

            <ModularDropdown
                data={hourOptions}
                selectedValue={hours}
                onSelect={(value) =>
                    onTimeChange(`${value}:${minutes} ${meridiem}`)
                }
                placeholderText="HH"
                containerStyle={styles.dropdownButton}
                buttonStyle={GlobalStyles.input}
                disabled={disabled}
            />

            <ModularDropdown
                data={minuteOptions}
                selectedValue={minutes}
                onSelect={(value) =>
                    onTimeChange(`${hours}:${value} ${meridiem}`)
                }
                placeholderText="MM"
                labelText=":"
                containerStyle={styles.dropdownButton}
                disabled={disabled}
            />

            <ModularDropdown
                data={meridiemOptions}
                selectedValue={meridiem}
                onSelect={(value) =>
                    onTimeChange(`${hours}:${minutes} ${value}`)
                }
                placeholderText="AM/PM"
                containerStyle={styles.dropdownButton}
                disabled={disabled}
            />

        </View>

    );

};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
    },
    dropdownButton: {
        minWidth: 0,
        alignSelf: "flex-start",
        flexShrink: 1,
    },
});

export default TimeDropdown;