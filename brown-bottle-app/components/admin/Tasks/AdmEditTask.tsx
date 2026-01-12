import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import dayjs from "dayjs";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import ModularModal from "@/components/modular/ModularModal";
import ModularButton from "@/components/modular/ModularButton";

import TaskModalContent, { TaskFormState } from "@/components/admin/Tasks/Templates/TaskModalContent";

import { Task, ConvertTask } from "@/types/iTask";
import { RecurringTask } from "@/types/iRecurringTask";

import { updateTask, convertTask } from "@/routes/task";
import { updateRecurringTask } from "@/routes/recurring_task";

import { dayCheckboxOptions } from "@/types/iCheckbox";

import { useConfirm } from "@/hooks/useConfirm";
import { useSession } from "@/utils/SessionContext";

interface Props {
    task: Task | RecurringTask;
    visible: boolean;
    onClose: () => void;
    onUpdate: () => void;
}
const AdmEditTask: React.FC<Props> = ({ task, visible, onClose, onUpdate }) => {
    if (!task) return null;

    const { user } = useSession();
    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(false);

    const buildInitialFormState = (item: Task | RecurringTask): TaskFormState => {
        // Build Recurring Task Form
        if (item.type === 'recurring') {
            return {
                title: item.title,
                description: item.description,
                selectedSection: item.section_id,
                dueDate: dayjs(item.start_date).format("YYYY-MM-DD"),
                isRecurring: true,
                recurrenceDays: dayCheckboxOptions.filter(opt =>
                    item[opt.value as keyof RecurringTask] === 1
                ),
                startDate: item.start_date,
                endDate: item.end_date ?? null,
                noEndDate: !item.end_date,
            };
        }

        // Otherwise, build Normal Task Form
        return {
            title: item.title,
            description: item.description,
            selectedSection: item.section_id,
            dueDate: item.due_date,
            isRecurring: false,
            recurrenceDays: [],
            startDate: item.due_date,
            endDate: null,
            noEndDate: false,
        };
    };

    // Form State
    const [formState, setFormState] = useState<TaskFormState>(
        buildInitialFormState(task)
    );

    // Initialize Task/Recurring Task on initialization and state update
    useEffect(() => {
        setFormState(buildInitialFormState(task));
    }, [task]);

    // Form Validation
    const isValidForm =
        formState.title.trim().length > 0 &&
        formState.description.trim().length > 0 &&
        formState.selectedSection !== null &&
        (!formState.isRecurring || formState.recurrenceDays.length > 0) &&
        (!formState.isRecurring || formState.noEndDate || dayjs(formState.endDate).isAfter(dayjs(formState.startDate)));

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

    const handleUpdate = async () => {
        if (!user || !formState.selectedSection) return;

        // Determine if task type changed => conversion
        const originalIsRecurring = task.type === 'recurring';
        const editedIsRecurring = formState.isRecurring;
        const isConversion = originalIsRecurring !== editedIsRecurring;
        const conversionDirection: ConvertTask['direction'] =
            editedIsRecurring ? 'to_recurring' : 'to_normal';

        // Confirmation
        let confirmMessage = "Save changes to this task?";

        if (isConversion) {
            confirmMessage =
                conversionDirection === 'to_recurring'
                    ? "This will convert the normal task into a recurring task. Proceed?"
                    : "This will convert the recurring task into a normal task. Proceed?";
        }

        const ok = await confirm("Confirm Changes", confirmMessage);
        if (!ok) return;

        // API Routes
        try {
            setLoading(true);

            if (isConversion) {
                // Task Conversion

                const recurrenceDays = getRecurrenceDays();

                const payload: ConvertTask = {
                    direction: conversionDirection,
                    title: formState.title,
                    description: formState.description,
                    author_id: Number(user.employee_id),
                    section_id: formState.selectedSection,

                    // Task Ids
                    task_id: originalIsRecurring ? undefined : task.task_id,
                    recurring_task_id: originalIsRecurring ? task.recurring_task_id : undefined,

                    // Dates
                    due_date: formState.dueDate,                       // used when converting to normal
                    start_date: formState.startDate,                   // used when converting to recurring
                    end_date: formState.noEndDate ? null : formState.endDate,
                    ...recurrenceDays,
                };
                await convertTask(payload);
            } else {
                // Update Normal Task
                if (!originalIsRecurring) {
                    await updateTask(task.task_id, {
                        title: formState.title,
                        description: formState.description,
                        section_id: formState.selectedSection,
                        due_date: formState.dueDate,
                    });
                } else {
                    // Update Recurring Task
                    const recurrenceDays = getRecurrenceDays();
                    await updateRecurringTask(task.recurring_task_id, {
                        title: formState.title,
                        description: formState.description,
                        section_id: formState.selectedSection,
                        start_date: formState.startDate,
                        end_date: formState.noEndDate ? null : formState.endDate,
                        ...recurrenceDays,
                    });
                }
            }

            alert("Task updated successfully!");
            onUpdate();
            onClose();
        } catch (error: any) {
            alert("Failed to update task!");
            console.log("Failed to update task:", error?.message ?? error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <ModularModal visible={visible} onClose={onClose} scroll={false}>
            <TaskModalContent
                formState={formState}
                setFormState={setFormState}
                titleText={"Edit Task"}
            />

            <View style={GlobalStyles.buttonRowContainer}>
                <ModularButton
                    text="Save"
                    textStyle={{ color: 'white' }}
                    style={[GlobalStyles.submitButton, { flex: 1 }]}
                    onPress={handleUpdate}
                    enabled={isValidForm && !loading}
                />
                <ModularButton
                    text="Cancel"
                    textStyle={{ color: 'gray' }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
                    onPress={onClose}
                />
            </View>
        </ModularModal>
    );
};

const styles = StyleSheet.create({
});

export default AdmEditTask;
