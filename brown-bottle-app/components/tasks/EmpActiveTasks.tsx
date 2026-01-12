import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import ModularListView from "@/components/modular/ModularListView";

import TaskListItem from '@/components/admin/Tasks/Templates/TaskListItem';
import EmpTaskModal from "@/components/tasks/EmpTaskModal";

import { Shift, GetShift } from "@/types/iShift";
import { getShift } from "@/routes/shift";

import { Task, GetTask, UpdateTask } from "@/types/iTask";
import { getTask, updateTask } from "@/routes/task";

import { User } from "@/utils/SessionContext";

interface Props {
    user: User
    parentRefresh?: number;
    onRefreshDone?: () => void;
}

const EmpActiveTasks: React.FC<Props> = ({ user, parentRefresh, onRefreshDone }) => {
    if (!user) return;

    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionId, setSectionId] = useState<number | null>(null);
    const [hasShiftToday, setHasShiftToday] = useState<boolean | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [activeTasks, setActiveTasks] = useState<Task[]>([]);
    const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // List View Scaling
    const isMobile = WIDTH < 768;
    const listHeight = isMobile ? height * 0.25 : height * 0.28;

    // Decide height based on overdueTasks
    const expandedActiveHeight = isMobile ? height * 0.6 : height * 0.6; // 60% of screen height
    const activeListHeight = overdueTasks.length > 0 ? listHeight : expandedActiveHeight;


    // Check if user has a shift today...
    const fetchTodayShift = useCallback(async () => {
        setError(null);
        setLoading(true);

        try {
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
            setError('Failed to fetch user shift!');
            console.log('Failed to fetch user shift:', error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Active Tasks (Incomplete tasks for due_date >= Today's Date)
    const fetchActiveTasks = useCallback(async () => {
        try {
            if (!sectionId) return;

            setError(null);
            setLoading(true);

            const params: Partial<GetTask> = {
                section_id: sectionId,
                today: 1,
                future: 1,
                complete: 0
            };
            const data = await getTask(params);
            setActiveTasks(data);

        } catch (error: any) {
            setError('Failed to fetch active tasks!');
            console.log('Failed to fetch active tasks:', error.message);
        } finally {
            setLoading(false);
        }
    }, [sectionId, hasShiftToday]);

    // Fetch Overdue Tasks (Incomplete tasks for due date < Today's Date)
    const fetchOverdueTasks = useCallback(async () => {
        try {
            if (!sectionId) return;

            setError(null);
            setLoading(true);

            const params: Partial<GetTask> = {
                section_id: sectionId,
                past: 1,
                complete: 0
            };
            const data = await getTask(params);
            setOverdueTasks(data);

        } catch (error: any) {
            setError('Failed to fetch overdue tasks.');
            console.log('Failed to fetch overdue tasks', error.message);
        } finally {
            setLoading(false);
        }
    }, [sectionId, hasShiftToday]);

    // Complete a Task
    const handleComplete = async (task: Task) => {
        try {
            setLoading(true);

            await updateTask(task.task_id, {
                complete: 1,
                last_modified_by: user.employee_id,
            })
            setModalVisible(false);
            alert("Task has been completed!")
            setLocalRefresh((prev) => prev + 1);
        } catch (error: any) {
            alert("Failed to complete task! Try again later.")
            console.error("Failed to mark task as complete:", error.message)
        } finally {
            setLoading(false);
        }
    };


    // Only fetch shift when refresh changes
    useEffect(() => {
        fetchTodayShift();
    }, [localRefresh, parentRefresh]);

    // Fetch tasks when sectionId changes
    useEffect(() => {
        if (sectionId) {
            fetchActiveTasks();
            fetchOverdueTasks();
        }
    }, [sectionId, localRefresh, parentRefresh]);


    if (hasShiftToday === false) {
        return (
            <View style={{ alignItems: "center" }}>
                <Text style={GlobalStyles.floatingHeaderText}>
                    No Shift Today
                </Text>
                <Text style={GlobalStyles.semiBoldAltText}>
                    No tasks assigned.
                </Text>
            </View>
        );
    }

    const handlePress = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };


    const renderTask = (task: Task) => {
        return <TaskListItem task={task} />
    };

    return (

        <View style={{ width: "100%" }}>

            {/* Active Tasks */}
            <Text style={GlobalStyles.floatingHeaderText}>
                Active Tasks
            </Text>

            <ModularListView
                data={activeTasks}
                loading={loading}
                error={error}
                emptyText="No active tasks."
                listHeight={activeListHeight}
                renderItem={renderTask}
                keyExtractor={(item) => String(item.task_id)}
                onItemPress={(item) => handlePress(item)}
                itemContainerStyle={styles.taskContainer}
            />

            {/* Overdue Tasks (Conditionally Exists) */}

            {overdueTasks.length > 0 && (
                <View style={{ marginVertical: 10 }}>
                    <Text style={GlobalStyles.floatingHeaderText}>
                        Overdue Tasks
                    </Text>

                    <ModularListView
                        data={overdueTasks}
                        loading={loading}
                        error={error}
                        emptyText="No overdue tasks."
                        listHeight={listHeight}
                        renderItem={renderTask}
                        keyExtractor={(item) => String(item.task_id)}
                        onItemPress={(item) => handlePress(item)}
                        refreshing={loading}
                        //onRefresh={fetchOverdueTasks}
                        itemContainerStyle={styles.taskContainer}
                    />
                </View>
            )}

            {selectedTask &&
                <EmpTaskModal
                    task={selectedTask}
                    mode={"active"}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={handleComplete}
                    loading={loading}
                />
            }
        </View>

    );
};

const styles = StyleSheet.create({
    taskContainer: {
        backgroundColor: "white",
    }
});

export default EmpActiveTasks;

