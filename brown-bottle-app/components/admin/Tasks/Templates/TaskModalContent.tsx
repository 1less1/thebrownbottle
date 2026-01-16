import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    Pressable, TouchableOpacity, useWindowDimensions
} from 'react-native';
import dayjs from 'dayjs';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import SectionDropdown from '@/components/modular/dropdown/SectionDropdown';
import HorizontalCheckboxList from '@/components/modular/checkbox/HorizontalCheckboxList';

import CalendarWidget from '@/components/calendar/CalendarWidget';
import { formatDateWithYear } from '@/utils/dateTimeHelpers';

import { CheckboxOption, dayCheckboxOptions } from '@/types/iCheckbox';

export interface TaskFormState {
    title: string;
    description: string;
    selectedSection: number | null;
    dueDate: string;
    isRecurring: boolean;
    recurrenceDays: CheckboxOption<string>[];
    startDate: string;
    endDate: string | null;
    noEndDate: boolean;
}

interface Props {
    formState: TaskFormState;
    setFormState: React.Dispatch<React.SetStateAction<TaskFormState>>;
    titleText: string;
}

// Reusable Admin Task Modal Content
const TaskModalContent: React.FC<Props> = ({ formState, setFormState, titleText }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const TITLE_MAX_CHARS = 150;
    const DESC_MAX_CHARS = 350;

    // Helper to update specific keys in the object
    const update = (updates: Partial<TaskFormState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const toggleDatePicker = () => setDatePickerVisible(!datePickerVisible);

    const [rangePickerVisible, setRangePickerVisible] = useState(false);
    const toggleRangePicker = () => setRangePickerVisible(!rangePickerVisible);

    const [tempStartDate, setTempStartDate] = useState(formState.startDate);
    const [tempEndDate, setTempEndDate] = useState(formState.endDate);

    const [hasFullRange, setHasFullRange] = useState(false);

    useEffect(() => {
        setTempStartDate(formState.startDate);
        setTempEndDate(formState.endDate);
    }, [formState.startDate, formState.endDate]);


    return (

        <>
            <Text style={GlobalStyles.modalTitle}>{titleText}</Text>

            {/* Form */}
            <View style={[styles.formContainer, { maxHeight: height * 0.45 }]}>
                <ScrollView>

                    <TextInput
                        placeholder="Title"
                        value={formState.title}
                        onChangeText={(text) => {
                            if (text.length <= TITLE_MAX_CHARS) update({ title: text })
                        }}
                        style={[GlobalStyles.input, { marginBottom: 5 }]}
                    />
                    <Text style={{ color: Colors.gray, marginBottom: 10 }}>
                        {formState.title.length}/{TITLE_MAX_CHARS}
                    </Text>

                    <TextInput
                        placeholder="Description"
                        value={formState.description}
                        onChangeText={(text) => {
                            if (text.length <= DESC_MAX_CHARS) update({ description: text });
                        }}
                        multiline
                        numberOfLines={4}
                        style={[GlobalStyles.input, { marginBottom: 5 }]}
                    />
                    <Text style={{ color: Colors.gray, marginBottom: 10 }}>
                        {formState.description.length}/{DESC_MAX_CHARS}
                    </Text>

                    <View style={{ marginBottom: 15 }}>
                        <SectionDropdown
                            selectedSection={formState.selectedSection}
                            onSectionSelect={(value) => update({ selectedSection: value })}
                            labelText="Assign To:"
                            usePlaceholder={false}
                        />
                    </View>

                    {/* Singular Due Date */}
                    {!formState.isRecurring && (
                        <>
                            <View style={styles.pickerRow}>
                                <ModularButton
                                    text='Due Date'
                                    textStyle={{ color: Colors.blue }}
                                    style={styles.datePickerButton}
                                    onPress={toggleDatePicker}
                                />
                                <View style={styles.dateContainer}>
                                    <Text style={[GlobalStyles.text, { color: Colors.blue }]}>{formatDateWithYear(formState.dueDate)}</Text>
                                </View>
                            </View>

                            <ModularModal
                                visible={datePickerVisible}
                                onClose={toggleDatePicker}
                            >
                                <CalendarWidget
                                    mode="picker"
                                    pickerType="single"
                                    showShifts={false}
                                    initialDate={formState.dueDate}
                                    onSelectDate={({ date }) => { update({ dueDate: date }); setDatePickerVisible(false); }}
                                />
                                <View>
                                    <ModularButton
                                        text="Cancel"
                                        style={GlobalStyles.cancelButton}
                                        textStyle={{ color: 'gray' }}
                                        onPress={toggleDatePicker}
                                    />
                                </View>
                            </ModularModal>
                        </>
                    )}

                    {/* Recurring Checkbox */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, }}>
                        <Pressable
                            onPress={() => {
                                if (formState.isRecurring) {
                                    // Turning OFF recurring → clean up recurring-only formState
                                    update({
                                        isRecurring: false,
                                        recurrenceDays: [],
                                        startDate: formState.dueDate,
                                        dueDate: dayjs().format('YYYY-MM-DD'),
                                        endDate: null,
                                        noEndDate: false,
                                    });
                                } else {
                                    // Turning ON recurring → initialize from dueDate
                                    update({
                                        isRecurring: true,
                                        startDate: formState.dueDate,
                                        endDate: dayjs(formState.dueDate).add(1, 'day').format('YYYY-MM-DD'),
                                        noEndDate: false,
                                    });
                                }
                            }}
                            style={{ marginRight: 5 }}
                        >
                            <Ionicons
                                name={formState.isRecurring ? "checkbox-outline" : "square-outline"}
                                size={20}
                                color={formState.isRecurring ? Colors.blue : Colors.gray}
                            />
                        </Pressable>
                        <Text style={GlobalStyles.mediumText}>Recurring Task</Text>
                    </View>

                    {/* Recurring Task Components */}
                    {formState.isRecurring && (
                        <>
                            {/* Day Checkboxes */}
                            <View style={{ marginBottom: 15 }}>
                                <HorizontalCheckboxList
                                    data={dayCheckboxOptions}
                                    selectedData={formState.recurrenceDays}
                                    onSelect={(keys, values) => {
                                        const formatted = values.map((v, i) => ({ key: keys[i], value: v }));
                                        update({ recurrenceDays: formatted });
                                    }}
                                    labelText={"Days:"}
                                />
                            </View>

                            {/* Date Range Picker */}
                            <>
                                <View style={styles.pickerRow}>
                                    <ModularButton
                                        text="Range"
                                        textStyle={{ color: Colors.purple }}
                                        style={styles.rangePickerButton}
                                        onPress={() => {
                                            setTempStartDate(formState.startDate);
                                            setTempEndDate(formState.endDate);
                                            setHasFullRange(false);
                                            toggleRangePicker();;
                                        }}

                                    />

                                    <View style={styles.dateContainer}>
                                        <Text style={[GlobalStyles.text, { color: Colors.purple }]}>
                                            {formatDateWithYear(formState.startDate).replace(/ /g, '\u00A0')}
                                            {!formState.noEndDate ? (
                                                <>
                                                    {/* The space AFTER the arrow is a standard space, allowing the wrap here */}
                                                    {" → "}
                                                    {formState.endDate
                                                        ? formatDateWithYear(formState.endDate).replace(/ /g, '\u00A0')
                                                        : "..."}
                                                </>
                                            ) : (
                                                " → Forever"
                                            )}
                                        </Text>
                                    </View>

                                    <ModularModal
                                        visible={rangePickerVisible}
                                        onClose={toggleRangePicker}
                                    >
                                        <CalendarWidget
                                            mode="picker"
                                            pickerType="range"
                                            showShifts={false}
                                            onSelectRange={({ startDate, endDate }) => {
                                                setTempStartDate(startDate);

                                                if (!formState.noEndDate) {
                                                    setTempEndDate(endDate);
                                                }
                                                // Detect whether user selected a full range
                                                setHasFullRange(!!endDate && startDate !== endDate);
                                            }}
                                        />

                                        <View style={[styles.dateContainer, { marginTop: 10 }]}>
                                            <Text style={GlobalStyles.text}>
                                                Selected:{" "}
                                                <Text style={[GlobalStyles.semiBoldText, { color: Colors.purple }]}>
                                                    {formatDateWithYear(tempStartDate).replace(/ /g, '\u00A0')}
                                                    {!formState.noEndDate ? (
                                                        <>
                                                            {" → "}
                                                            {tempEndDate
                                                                ? formatDateWithYear(tempEndDate).replace(/ /g, '\u00A0')
                                                                : "..."}
                                                        </>
                                                    ) : (
                                                        " → Forever"
                                                    )}
                                                </Text>
                                            </Text>
                                        </View>

                                        {/* Buttons */}
                                        <View style={GlobalStyles.buttonRowContainer}>
                                            <ModularButton
                                                text="Confirm"
                                                textStyle={{ color: 'white' }}
                                                style={[GlobalStyles.submitButton, { flexGrow: 1 }]}
                                                onPress={() => {
                                                    if (formState.noEndDate) {
                                                        update({
                                                            startDate: tempStartDate,
                                                            endDate: null,
                                                        });
                                                        toggleRangePicker();
                                                        return;
                                                    }

                                                    if (!hasFullRange) {
                                                        alert("Please select an end date.");
                                                        return;
                                                    }

                                                    update({
                                                        startDate: tempStartDate,
                                                        endDate: tempEndDate,
                                                    });

                                                    toggleRangePicker();
                                                }}
                                            />

                                            <ModularButton
                                                text="Cancel"
                                                textStyle={{ color: 'gray' }}
                                                style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
                                                onPress={toggleRangePicker}
                                            />
                                        </View>
                                    </ModularModal>
                                </View>
                            </>


                            {/* No End Date Checkbox */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, }}>
                                <Pressable
                                    onPress={() => {
                                        if (!formState.noEndDate) {
                                            update({
                                                noEndDate: true,
                                                endDate: null,
                                            });
                                        } else {
                                            update({
                                                noEndDate: false,
                                                endDate: dayjs(formState.startDate)
                                                    .add(1, 'day')
                                                    .format('YYYY-MM-DD'),
                                            });
                                        }
                                    }}

                                    style={{ marginRight: 5 }}
                                >
                                    <Ionicons
                                        name={formState.noEndDate ? "checkbox-outline" : "square-outline"}
                                        size={20}
                                        color={formState.noEndDate ? Colors.purple : Colors.gray}
                                    />
                                </Pressable>
                                <Text style={GlobalStyles.mediumText}>No End Date</Text>
                            </View>
                        </>
                    )}

                </ScrollView>
            </View>
        </>

    );

};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: "wrap",
        marginBottom: 10
    },
    formContainer: {
        gap: 12,
        marginTop: 10,
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 5,
        marginBottom: 15,
    },
    dateContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: Colors.borderColor,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    datePickerButton: {
        backgroundColor: Colors.bgBlue,
        borderColor: Colors.borderBlue,
        borderWidth: 1,
        flexShrink: 0,
        justifyContent: 'center',
        paddingVertical: 0,
    },
    rangePickerButton: {
        backgroundColor: Colors.bgPurple,
        borderColor: Colors.borderPurple,
        borderWidth: 1,
        flexShrink: 0,
        justifyContent: 'center',
        paddingVertical: 0,
    }
})

export default TaskModalContent;