import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ModularListView from "@/components/modular/ModularListView";
import { getTasks } from "@/routes/task";
import { getShift } from "@/routes/shift";
import { User } from "@/utils/SessionContext";
import { Task } from "@/types/iTask";
import { Colors } from "@/constants/Colors";
import LoadingCircle from "../modular/LoadingCircle";
import { formatDateTime } from "@/utils/dateTimeHelpers";
import ModularModal from "../modular/ModularModal";
import TaskDetailsModal from "./TaskDetailsModal";
import { updateTask } from "@/routes/task";
import { Alert } from "react-native";

interface CompletedTasksProps {
    user: User;
    refreshKey: number;
    onRefresh: () => void;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ user, refreshKey, onRefresh }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionId, setSectionId] = useState<number | null>(null);
    const [hasShiftToday, setHasShiftToday] = useState<boolean | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);


    // Get user's shift today
    useEffect(() => {
        const loadShift = async () => {
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

        loadShift();
    }, []);

    // Fetch completed tasks only if user has shift
    useEffect(() => {
        if (!sectionId) return;

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getTasks({
                    section_id: sectionId,
                    complete: 1, // <-- Completed tasks only
                });

                setTasks(data);
            } catch {
                setError("Failed to load completed tasks.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [sectionId, refreshKey, hasShiftToday]);

    const handlePress = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handleUndo = async (task: Task) => {
        try {
            await updateTask(task.task_id, {
                complete: 0,
                last_modified_by: user.employee_id,
            });
            setModalVisible(false);
            onRefresh();
            Alert.alert("Completion has been Undone")
        } catch (err) {
            console.error("Error undoing task:", err);
        }
    };


    // UI: Loading
    if (loading) {
        return (
            <LoadingCircle />
        );
    }

    // UI: No shift today
    if (hasShiftToday === false) {
        return (
            <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                    No Shift Today
                </Text>
                <Text style={{ opacity: 0.6, marginTop: 4 }}>
                    No completed tasks assigned.
                </Text>
            </View>
        );
    }

    // UI: Completed Tasks list
    return (
        <View style={{ width: "100%", flex: 1 }}>
            <ModularListView
                data={tasks}
                loading={loading}
                error={error}
                listHeight = "full"
                emptyText="No completed tasks."
                keyExtractor={(task) => String(task.task_id)}
                refreshing={loading}
                onRefresh={() => { }}
                renderItem={(task) => (
                    <TouchableOpacity onPress={() => handlePress(task)}>
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
                                <Text style={{ color: Colors.gray }}>Completed by </Text>
                                <Text style={{ color: "#535353ff", fontWeight: "500" }}>{task.last_modified_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: Colors.gray }}>Due: </Text>
                                <Text style={{ color: "#535353ff", fontWeight: "500" }}>{task.due_date}</Text>
                            </View>
                            <Text style={styles.timestamp}>Assigned On {formatDateTime(task.timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <TaskDetailsModal
                visible={modalVisible}
                task={selectedTask}
                onClose={() => setModalVisible(false)}
                onComplete={handleUndo}
                actionLabel="Mark As Incomplete"
            />

        </View>
    );
};

export default CompletedTasks;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    scrollContainer: {
        height: 380,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    buttonRowContainer: {
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    button: {
        width: '100%'
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
        marginTop: 4,
    }
});

