import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    Pressable, TouchableOpacity, useWindowDimensions
} from 'react-native';
import dayjs from 'dayjs';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from '@/components/modular/Card';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import SectionDropdown from '@/components/modular/dropdown/SectionDropdown';
import HorizontalCheckboxList from '@/components/modular/checkbox/HorizontalCheckboxList';

import CalendarWidget from '@/components/calendar/CalendarWidget';
import { formatDateWithYear } from '@/utils/dateTimeHelpers';

import { InsertTask } from '@/types/iTask';
import { insertTask } from '@/routes/task';

import { InsertRecurringTask } from '@/types/iRecurringTask';
import { insertRecurringTask } from '@/routes/recurring_task';

import { CheckboxOption, dayCheckboxOptions } from '@/types/iCheckbox';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from "@/utils/SessionContext";

interface Props {
    onSubmit: () => void;
}

const NewTask: React.FC<Props> = ({ onSubmit }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const buttonHeight = HEIGHT * 0.15;

    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible);

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const toggleDatePicker = () => setDatePickerVisible(!datePickerVisible);

    const [rangePickerVisible, setRangePickerVisible] = useState(false);
    const toggleRangePicker = () => setRangePickerVisible(!rangePickerVisible);
    const [hasFullRange, setHasFullRange] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const MAX_CHARS = 500;

    const [selectedSection, setSelectedSection] = useState<number | null>(1);

    const [dueDate, setDueDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to today's date

    const [isRecurring, setIsRecurring] = useState(false);

    const [recurrenceDays, setRecurrenceDays] = useState<CheckboxOption<string>[]>([]);

    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to today's date
    const [endDate, setEndDate] = useState<string | null>(dayjs().add(1, 'day').format('YYYY-MM-DD')); // Default to tomorrow's date

    const [tempStartDate, setTempStartDate] = useState(startDate);
    const [tempEndDate, setTempEndDate] = useState(endDate);

    const [noEndDate, setNoEndDate] = useState(false);

    const { confirm } = useConfirm();
    const { user } = useSession();

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate(dayjs().format('YYYY-MM-DD'))
        setSelectedSection(1);
        setIsRecurring(false);
        setRecurrenceDays([]);
        setStartDate(dayjs().format('YYYY-MM-DD'))
        setEndDate(dayjs().add(1, 'day').format('YYYY-MM-DD'));
        setNoEndDate(false);
    };

    const handleAssign = async () => {
        if (!user) return;

        if (!title.trim() || !description.trim() || selectedSection === null) {
            alert("Please fill in all required fields!");
            return;
        }

        // Confirmation Popup
        const ok = await confirm(
            "Confirm Task",
            `Are you sure you want to assign this task?`
        );

        if (!ok) return;

        try {

            if (!isRecurring) {
                const payload: InsertTask = {
                    author_id: Number(user.employee_id),
                    title: title,
                    description: description,
                    section_id: selectedSection,
                    due_date: dueDate,
                }
                await insertTask(payload);

                alert("Task assigned successfully!");
            } else {

                const selectedKeys = new Set(recurrenceDays.map(d => d.key));

                const payload: InsertRecurringTask = {
                    author_id: Number(user.employee_id),
                    title: title,
                    description: description,
                    section_id: selectedSection,
                    mon: selectedKeys.has("Mon") ? 1 : 0,
                    tue: selectedKeys.has("Tue") ? 1 : 0,
                    wed: selectedKeys.has("Wed") ? 1 : 0,
                    thu: selectedKeys.has("Thu") ? 1 : 0,
                    fri: selectedKeys.has("Fri") ? 1 : 0,
                    sat: selectedKeys.has("Sat") ? 1 : 0,
                    sun: selectedKeys.has("Sun") ? 1 : 0,
                    start_date: startDate,
                };

                if (!noEndDate) {
                    payload.end_date = endDate
                }

                await insertRecurringTask(payload);
                alert("Recurring Task assigned successfully!");
            }

            resetForm();
            toggleModal();
            onSubmit();
        } catch (error: any) {
            console.error("Failed to assign task:", error.message);
            alert("Failed to assign task!");
        }
    };

    const handleClose = () => {
        resetForm();
        toggleModal();
    };

    return (

        <>
            {/* New Task Button */}
            <Card style={[styles.buttonContainer, { height: buttonHeight }]}>
                <TouchableOpacity onPress={toggleModal} style={styles.button}>
                    <Ionicons name="create" size={30} color="black" style={styles.icon} />
                    <Text style={GlobalStyles.boldText}>New Task</Text>
                </TouchableOpacity>
            </Card>

            {/* New Task Modal */}
            <ModularModal visible={modalVisible} onClose={handleClose} scroll={false}>

                <Text style={GlobalStyles.modalTitle}>New Task</Text>

                {/* Form */}
                <View style={[styles.formContainer, { maxHeight: height * 0.45 }]}>
                    <ScrollView>

                        <TextInput
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                            style={[GlobalStyles.input, { marginBottom: 15 }]}
                        />

                        <TextInput
                            placeholder="Description"
                            value={description}
                            onChangeText={(text) => {
                                if (text.length <= MAX_CHARS) setDescription(text);
                            }}
                            multiline
                            numberOfLines={4}
                            style={[GlobalStyles.input, { marginBottom: 5 }]}
                        />
                        <Text style={{ color: Colors.gray, marginBottom: 10 }}>
                            {description.length}/{MAX_CHARS}
                        </Text>

                        <View style={{ marginBottom: 15 }}>
                            <SectionDropdown
                                selectedSection={selectedSection}
                                onSectionSelect={setSelectedSection}
                                labelText="Assign To:"
                                usePlaceholder={false}
                            />
                        </View>

                        {/* Singular Due Date */}
                        {!isRecurring && (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15, }}>
                                    <ModularButton
                                        text='Choose Due Date'
                                        textStyle={{ color: Colors.blue }}
                                        style={[{ backgroundColor: Colors.bgBlue, borderColor: Colors.borderBlue, borderWidth: 1, flexShrink: 1, paddingHorizontal: 15, }]}
                                        onPress={toggleDatePicker}
                                    />
                                    <View style={styles.dateContainer}>
                                        <Text style={GlobalStyles.text}>Date: </Text>
                                        <Text style={[GlobalStyles.text, { color: Colors.blue }]}>{formatDateWithYear(dueDate)}</Text>
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
                                        initialDate={dueDate}
                                        onSelectDate={({ date }) => { setDueDate(date), toggleDatePicker() }}
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
                            <Pressable onPress={() => setIsRecurring(!isRecurring)} style={{ marginRight: 5 }}>
                                <Ionicons
                                    name={isRecurring ? "checkbox-outline" : "square-outline"}
                                    size={20}
                                    color={isRecurring ? Colors.blue : Colors.gray}
                                />
                            </Pressable>
                            <Text style={GlobalStyles.mediumText}>Recurring Task</Text>
                        </View>

                        {/* Recurring Task Components */}
                        {isRecurring && (
                            <>
                                {/* Day Checkboxes */}
                                <View style={{ marginBottom: 15 }}>
                                    <HorizontalCheckboxList
                                        data={dayCheckboxOptions}
                                        selectedData={recurrenceDays}
                                        onSelect={(keys, values) => {
                                            setRecurrenceDays(values.map((value, index) => ({
                                                key: keys[index],
                                                value: value,
                                            })));
                                        }}
                                        labelText={"Select Days:"}
                                    />
                                </View>

                                {/* Date Range Picker */}
                                <>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15 }}>
                                        <ModularButton
                                            text="Choose Range"
                                            textStyle={{ color: Colors.purple }}
                                            style={[
                                                { backgroundColor: Colors.bgPurple, borderColor: Colors.borderPurple, borderWidth: 1, flexShrink: 1 }
                                            ]}
                                            onPress={() => {
                                                setTempStartDate(startDate);
                                                setTempEndDate(endDate);
                                                setHasFullRange(false);
                                                toggleRangePicker();;
                                            }}

                                        />

                                        <View style={styles.dateContainer}>
                                            <Text style={[GlobalStyles.text, { color: Colors.purple }]}>
                                                {formatDateWithYear(startDate)}
                                                {!noEndDate ? (
                                                    <>
                                                        {" → "}
                                                        {endDate ? formatDateWithYear(endDate) : "..."}
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

                                                    if (!noEndDate) {
                                                        setTempEndDate(endDate);
                                                    }
                                                    // Detect whether user selected a full range
                                                    setHasFullRange(startDate !== endDate);
                                                }}
                                            />

                                            <View style={[styles.dateContainer, { marginTop: 10 }]}>
                                                <Text style={GlobalStyles.text}>Selected: </Text>
                                                <Text style={[GlobalStyles.semiBoldText, { color: Colors.purple }]}>
                                                    {formatDateWithYear(tempStartDate)}
                                                    {!noEndDate ? (
                                                        <>
                                                            {" → "}
                                                            {tempEndDate ? formatDateWithYear(tempEndDate) : "..."}
                                                        </>
                                                    ) : (
                                                        " → Forever"
                                                    )}
                                                </Text>
                                            </View>

                                            <View style={GlobalStyles.buttonRowContainer}>
                                                <ModularButton
                                                    text="Confirm"
                                                    textStyle={{ color: 'white' }}
                                                    style={[GlobalStyles.submitButton, { flex: 1 }]}
                                                    onPress={() => {
                                                        if (noEndDate) {
                                                            setStartDate(tempStartDate);
                                                            setEndDate(null);
                                                            toggleRangePicker();
                                                            return;
                                                        }

                                                        if (!hasFullRange) {
                                                            alert("Please select an end date.");
                                                            return;
                                                        }

                                                        setStartDate(tempStartDate);
                                                        setEndDate(tempEndDate);
                                                        toggleRangePicker();
                                                    }}
                                                />

                                                <ModularButton
                                                    text="Cancel"
                                                    textStyle={{ color: 'gray' }}
                                                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
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
                                            setNoEndDate(!noEndDate);

                                            if (!noEndDate) {
                                                // Turning ON noEndDate → endDate must be null
                                                setEndDate(null);
                                            } else {
                                                // Turning OFF → auto-set endDate = startDate + 1 day
                                                setEndDate(dayjs(startDate).add(1, 'day').format('YYYY-MM-DD'));
                                            }
                                        }}
                                        style={{ marginRight: 5 }}
                                    >
                                        <Ionicons
                                            name={noEndDate ? "checkbox-outline" : "square-outline"}
                                            size={20}
                                            color={noEndDate ? Colors.purple : Colors.gray}
                                        />
                                    </Pressable>
                                    <Text style={GlobalStyles.mediumText}>No End Date</Text>
                                </View>
                            </>
                        )}

                    </ScrollView>
                </View>

                {/* Buttons */}
                <View style={GlobalStyles.buttonRowContainer}>
                    <ModularButton
                        text="Post"
                        textStyle={{ color: 'white' }}
                        style={[GlobalStyles.submitButton, { flex: 1 }]}
                        onPress={handleAssign}
                    />

                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={[GlobalStyles.cancelButton, { flex: 1 }]}
                        onPress={handleClose}
                    />
                </View>

            </ModularModal>
        </>

    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        minHeight: 120,
        maxHeight: 200,
        padding: 0,              // <— remove padding so Touchable can fill
        overflow: 'hidden',      // keeps ripple/press effects clean
    },
    button: {
        flex: 1,            // <— THIS is the key
        width: '100%',      // ensures full horizontal fill
        height: '100%',     // ensures full vertical fill
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    icon: {
        marginBottom: 8,
    },
    formContainer: {
        gap: 12,
        marginTop: 10,
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
        alignItems: 'center',
        textAlignVertical: 'center',
    },
});

export default NewTask;
