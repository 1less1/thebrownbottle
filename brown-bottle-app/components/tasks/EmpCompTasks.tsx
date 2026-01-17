import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Alert, StyleSheet, useWindowDimensions } from "react-native";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import ModularListView from "@/components/modular/ModularListView";

import TaskListItem from '@/components/admin/Tasks/Templates/TaskListItem';
import EmpTaskModal from "@/components/tasks/EmpTaskModal";

import { Shift, GetShift } from "@/types/iShift";
import { getShift } from "@/routes/shift";

import { Task, GetTask } from "@/types/iTask";
import { getTask, updateTask } from "@/routes/task";

import { User } from "@/utils/SessionContext";

interface Props {
    user: User;
    parentRefresh?: number;
    onRefreshDone?: () => void;
}

const EmpCompTasks: React.FC<Props> = ({ user, parentRefresh, onRefreshDone }) => {
    if (!user) return;

    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;
    const listHeight = isMobile ? height * 0.6 : height * 0.6;

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionId, setSectionId] = useState<number | null>(null);
    const [hasShiftToday, setHasShiftToday] = useState<boolean | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Check if user has a shift today...
    const fetchTodayShift = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);

            const params: Partial<GetShift> = {
                employee_id: user.employee_id,
                is_today: 1,
            };
            const shift = await getShift(params);

            if (!shift || shift.length === 0) {
                setHasShiftToday(false);
                setSectionId(null);
            } else {
                setHasShiftToday(true);
                setSectionId(shift[0].section_id);
            }

        } catch (error: any) {
            setError("Failed to fetch user shift!");
            console.log("Failed to fetch user shift:", error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Completed Tasks (tasks with complete=1)
    const fetchCompletedTasks = useCallback(async () => {
        try {
            if (!sectionId) return;

            setError(null);
            setLoading(true);

            const params: Partial<GetTask> = {
                section_id: sectionId,
                complete: 1, // <-- Completed tasks only
            };
            const data = await getTask(params);
            setCompletedTasks(data);

        } catch (error: any) {
            setError("Failed to fetch completed tasks!");
            console.log("Failed to fetch completed tasks:", error.message);
        } finally {
            setLoading(false);
        }
    }, [sectionId, hasShiftToday]);

    // Undo completion of a task
    const handleUndo = async (task: Task) => {
        try {
            setLoading(true);

            await updateTask(task.task_id, {
                complete: 0,
                last_modified_by: user.employee_id,
            });
            setModalVisible(false);
            alert("Task has been marked as incomplete!");
            setLocalRefresh((prev) => prev + 1);
        } catch (error: any) {
            alert("Failed to mark as incomplete! Try again later.");
            console.error("Failed to mark task as incomplete:", error.message);
        } finally {
            setLoading(false);
        }
    };


    // Only fetch shift when refresh changes
    useEffect(() => {
        fetchTodayShift();
    }, [localRefresh, parentRefresh]);

    // Fetch completed tasks when sectionId changes
    useEffect(() => {
        if (sectionId) {
            fetchCompletedTasks();
        }
    }, [sectionId, localRefresh, parentRefresh]);


    if (hasShiftToday === false) {
        return (
            <View style={{ alignItems: "center" }}>
                <Text style={GlobalStyles.floatingHeaderText}>
                    No Shift Today
                </Text>
                <Text style={GlobalStyles.semiBoldAltText}>
                    No completed tasks.
                </Text>
            </View>
        );
    }

    const handlePress = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const renderTask = (task: Task) => {
        return <TaskListItem task={task} />;
    };

    return (
        <View style={{ width: "100%" }}>
            {/* Completed Tasks */}
            <Text style={GlobalStyles.floatingHeaderText}>
                Completed Tasks
            </Text>

            <ModularListView
                data={completedTasks}
                loading={loading}
                error={error}
                emptyText="No completed tasks."
                listHeight={listHeight}
                renderItem={renderTask}
                keyExtractor={(item) => String(item.task_id)}
                onItemPress={(item) => handlePress(item)}
                itemContainerStyle={styles.taskContainer}
            />

            {selectedTask &&
                <EmpTaskModal
                    task={selectedTask}
                    mode={"completed"}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={handleUndo}
                    loading={loading}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        backgroundColor: "white",
    },
});

export default EmpCompTasks;
