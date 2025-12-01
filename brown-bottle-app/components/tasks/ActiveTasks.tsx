import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ModularListView from "@/components/modular/ModularListView";
import { getTasks } from "@/routes/task";
import { getShift } from "@/routes/shift";
import { User } from "@/utils/SessionContext";
import { Task } from "@/types/iTask";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import LoadingCircle from "../modular/LoadingCircle";
import { TouchableOpacity, Pressable } from "react-native";
interface ActiveTasksProps {
    user: User;
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ user }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionId, setSectionId] = useState<number | null>(null);
    const [hasShiftToday, setHasShiftToday] = useState<boolean | null>(null);

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
    }, [sectionId]);

    // ------------------------------
    // Group + Sort Tasks
    // ------------------------------
    const upcomingTasks = tasks
        .filter((t) => new Date(t.due_date).setHours(0, 0, 0, 0) >= today)
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    const overdueTasks = tasks
        .filter((t) => new Date(t.due_date).setHours(0, 0, 0, 0) < today)
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

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

    return (
        <View style={{ width: "100%", flex: 1 }}>

            {/* UPCOMING TASKS */}
            {/* <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
                Upcoming Tasks
            </Text> */}

            <ModularListView
                data={upcomingTasks}
                loading={loading}
                error={error}
                emptyText="No upcoming tasks."
                keyExtractor={(task) => String(task.task_id)}
                refreshing={loading}
                onRefresh={() => { }}
                renderItem={(task) => (
                    <TouchableOpacity>
                        <View>
                            <Text style={{ fontWeight: "bold" }}>{task.title}</Text>
                            <Text style={{ color: Colors.gray }}>{task.due_date}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* OVERDUE SECTION (ONLY IF EXISTS) */}
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
                        listHeight={'100%'}
                        keyExtractor={(task) => String(task.task_id)}
                        refreshing={loading}
                        onRefresh={() => { }}
                        renderItem={(task) => (
                            <TouchableOpacity>
                                <View>
                                    <Text style={{ fontWeight: "bold", color: "#b3261e" }}>
                                        {task.title}
                                    </Text>
                                    <Text style={{ color: Colors.gray }}>{task.due_date}</Text>
                                </View>
                            </TouchableOpacity>

                        )}
                    />
                </>
            )}
        </View>
    );
};

export default ActiveTasks;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
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
    }
});

