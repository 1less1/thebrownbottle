import React, { useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import dayjs from 'dayjs';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import Card from '@/components/modular/Card';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import TaskModalContent, { TaskFormState } from '@/components/admin/Tasks/Templates/TaskModalContent';

import { InsertTask } from '@/types/iTask';
import { insertTask } from '@/routes/task';

import { InsertRecurringTask } from '@/types/iRecurringTask';
import { insertRecurringTask } from '@/routes/recurring_task';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from "@/utils/SessionContext";

interface Props {
    onSubmit: () => void;
}

const AdmNewTask: React.FC<Props> = ({ onSubmit }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const buttonHeight = HEIGHT * 0.15;

    const { user } = useSession();
    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible);

    const initialFormState: TaskFormState = {
        title: '',
        description: '',
        selectedSection: 1,
        dueDate: dayjs().format('YYYY-MM-DD'),
        isRecurring: false,
        recurrenceDays: [],
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        noEndDate: false,
    };

    // Form State
    const [formState, setFormState] = useState<TaskFormState>(initialFormState);

    const resetForm = () => {
        setFormState(initialFormState);
    };

    // Form Validation
    const isValidForm =
        formState.title.trim().length > 0 &&
        formState.description.trim().length > 0 &&
        formState.selectedSection !== null &&
        (!formState.isRecurring || formState.recurrenceDays.length > 0) &&
        (!formState.isRecurring || formState.noEndDate || dayjs(formState.endDate).isAfter(dayjs(formState.startDate)));


    const handleClose = () => {
        resetForm();
        toggleModal();
    };

    const getRecurrenceDays = () => {
        const selectedKeys = new Set(formState.recurrenceDays.map(d => d.key));
        return {
            mon: selectedKeys.has("Mon") ? 1 : 0,
            tue: selectedKeys.has("Tue") ? 1 : 0,
            wed: selectedKeys.has("Wed") ? 1 : 0,
            thu: selectedKeys.has("Thu") ? 1 : 0,
            fri: selectedKeys.has("Fri") ? 1 : 0,
            sat: selectedKeys.has("Sat") ? 1 : 0,
            sun: selectedKeys.has("Sun") ? 1 : 0,
        };
    };

    const handleAssign = async () => {
        if (!user || !formState.selectedSection) return;

        // Confirmation
        const ok = await confirm("Confirm Task", "Are you sure you want to assign this task?");
        if (!ok) return;

        // API Routes
        try {
            setLoading(true);

            if (!formState.isRecurring) {
                const payload: InsertTask = {
                    author_id: Number(user.employee_id),
                    title: formState.title,
                    description: formState.description,
                    section_id: formState.selectedSection,
                    due_date: formState.dueDate,
                };

                await insertTask(payload);
                alert("Task assigned successfully!");
            } else {
                const recurrenceDays = getRecurrenceDays();

                const payload: InsertRecurringTask = {
                    author_id: Number(user.employee_id),
                    title: formState.title,
                    description: formState.description,
                    section_id: formState.selectedSection,
                    start_date: formState.startDate,
                    ...(formState.noEndDate ? {} : { end_date: formState.endDate }),
                    ...recurrenceDays,
                };

                await insertRecurringTask(payload);
                alert("Recurring Task assigned successfully!");
            }

            resetForm();
            toggleModal();
            onSubmit();
        } catch (error: any) {
            console.error("Failed to assign task:", error.message);
            alert("Failed to assign task!");
        } finally {
            setLoading(false);
        }
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

                <TaskModalContent
                    formState={formState}
                    setFormState={setFormState}
                    titleText="New Task"
                />

                {/* Buttons */}
                <View style={GlobalStyles.buttonRowContainer}>
                    <ModularButton
                        text="Assign"
                        textStyle={{ color: 'white' }}
                        style={[GlobalStyles.submitButton, { flex: 1 }]}
                        onPress={handleAssign}
                        enabled={isValidForm && !loading}
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
        padding: 0,              // Remove padding so button can fill parent height
    },
    button: {
        flex: 1,
        width: '100%',      // Full horizontal fill
        height: '100%',     // ensures Full vertical fill
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    icon: {
        marginBottom: 8,
    },
});

export default AdmNewTask;
