import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import ModularListView from "@/components/modular/ModularListView";
import { getTasks } from "@/routes/task";
import { getShift } from "@/routes/shift";
import { User } from "@/utils/SessionContext";
import { Task } from "@/types/iTask";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import LoadingCircle from "../modular/LoadingCircle";
import { TouchableOpacity, Pressable } from "react-native";
import { formatDateTime } from "@/utils/dateTimeHelpers";
import { GlobalStyles } from "@/constants/GlobalStyles";
import TaskDetailsModal from "./TaskDetailsModal";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { updateTask } from "@/routes/task";
interface ActiveTasksProps {
    user: User;
    refreshKey: number;
    onRefresh: () => void;
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ user, refreshKey, onRefresh }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionId, setSectionId] = useState<number | null>(null);
    const [hasShiftToday, setHasShiftToday] = useState<boolean | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);


    const today = new Date().setHours(0, 0, 0, 0);

    // ------------------------------
    // Check if user has a shift today
    // ------------------------------
    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const result = await getShift({
                employee_id: user.employee_id,
                is_today: 1,
            });

            if (!result || result.length === 0) {
                setHasShiftToday(false);
                setLoading(false);
                return;
            }

            setSectionId(result[0].section_id);
            setHasShiftToday(true);
        };

        load();
    }, []);

    // ------------------------------
    // Fetch all incomplete tasks (not only today's)
    // ------------------------------
    useEffect(() => {
        if (!sectionId) return;

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getTasks({
                    section_id: sectionId,
                    complete: 0, // only incomplete tasks for this tab
                });

                setTasks(data);
            } catch {
                setError("Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [sectionId, refreshKey, hasShiftToday]);

    // ------------------------------
    // Group + Sort Tasks
    // ------------------------------
    const upcomingTasks = tasks
        .filter((t) => new Date(t.due_date).setHours(0, 0, 0, 0) >= today)
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    const overdueTasks = tasks
        .filter((t) => new Date(t.due_date).setHours(0, 0, 0, 0) < today)
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    const combinedList = [];

    if (upcomingTasks.length > 0) {
        combinedList.push({ type: "header", title: "Upcoming Tasks" });
        upcomingTasks.forEach(task => combinedList.push({ type: "task", data: task }));
    }

    if (overdueTasks.length > 0) {
        combinedList.push({ type: "header", title: "Overdue Tasks" });
        overdueTasks.forEach(task => combinedList.push({ type: "task", data: task }));
    }

    // ------------------------------
    // UI Conditions
    // ------------------------------

    if (loading) {
        return (
            <LoadingCircle />
        );
    }

    if (hasShiftToday === false) {
        return (
            <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                    No Shift Today
                </Text>
                <Text style={{ opacity: 0.6, marginTop: 4 }}>
                    No tasks assigned.
                </Text>
            </View>
        );
    }
    // ------------------------------
    // Handle Press
    // ------------------------------
    const handlePress = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handleComplete = async (task: Task) => {

        try {
            await updateTask(task.task_id, {
                complete: 1,
                last_modified_by: user.employee_id,
            })
            setModalVisible(false);
            onRefresh()
            Alert.alert("Task has been Completed")
        } catch (err) {
            console.error("Task completion failed: ", err)
        }

    };


    return (
        <View style={{ width: "100%" }}>

            {/* UPCOMING TASKS */}
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
                Upcoming Tasks
            </Text>

            <ModularListView
                data={upcomingTasks}
                loading={loading}
                error={error}
                emptyText="No upcoming tasks."
                keyExtractor={(task) => String(task.task_id)}
                refreshing={loading}
                onRefresh={() => { }}
                listHeight="auto"
                itemContainerStyle={styles.itemContainer}
                onItemPress={(task) => handlePress(task)}
                renderItem={(task) => (
                    <>
                        <View>
                            <View style={styles.rowBetween}>
                                <Text style={{ fontWeight: "bold" }}>{task.title}</Text>

                                {task.recurring_task_id !== null && (
                                    <Text style={styles.recurring}>
                                        Recurring
                                    </Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: Colors.gray }}>Due: </Text>
                                <Text style={{ color: "#535353ff", fontWeight: "500" }}>{task.due_date}</Text>
                            </View>
                            <Text style={styles.timestamp}>Assigned On {formatDateTime(task.timestamp)}</Text>
                        </View>
                    </>

                )}
            />

            {/* OVERDUE SECTION (ONLY IF EXISTS) */}
            <View style={{ width: '100%' }}>
                {overdueTasks.length > 0 && (
                    <>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 }}>
                            Overdue Tasks
                        </Text>

                        <ModularListView
                            data={overdueTasks}
                            loading={loading}
                            error={error}
                            emptyText=""
                            keyExtractor={(task) => String(task.task_id)}
                            refreshing={loading}
                            onRefresh={() => { }}
                            itemContainerStyle={styles.itemContainer}
                            onItemPress={(task) => handlePress(task)}
                            renderItem={(task) => (
                                <>
                                    <View>
                                        <View style={styles.rowBetween}>
                                            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>{task.title}</Text>

                                            {task.recurring_task_id !== null && (
                                                <Text style={styles.recurring}>
                                                    Recurring
                                                </Text>
                                            )}
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: Colors.gray }}>Due: </Text>
                                            <Text style={{ color: "#535353ff", fontWeight: "500" }}>{task.due_date}</Text>
                                        </View>
                                        <Text style={styles.timestamp}>Assigned On {formatDateTime(task.timestamp)}</Text>
                                    </View>
                                </>

                            )}
                        />

                    </>
                )}
            </View>

            <TaskDetailsModal
                visible={modalVisible}
                task={selectedTask}
                onClose={() => setModalVisible(false)}
                onComplete={handleComplete}
                actionLabel="Complete Task"
            />
        </View>
    );
};

export default ActiveTasks;

const styles = StyleSheet.create({
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemContainer: {
        backgroundColor: Colors.TaskBG,
        borderRadius: 16,
        padding: 18,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        marginVertical: 5,
    },
    recurring: {
        backgroundColor: Colors.bgGreen,
        padding: 6,
        borderRadius: 4,
        color: Colors.acceptGreen,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    timestamp: {
        fontSize: 12,
        color: Colors.gray,
    }
});

