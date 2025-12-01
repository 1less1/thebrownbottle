import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ModularListView from "@/components/modular/ModularListView";
import { getTasks } from "@/routes/task";
import { getShift } from "@/routes/shift";
import { User } from "@/utils/SessionContext";
import { Task } from "@/types/iTask";
import { Colors } from "@/constants/Colors";
import LoadingCircle from "../modular/LoadingCircle";

interface CompletedTasksProps {
    user: User;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ user }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionId, setSectionId] = useState<number | null>(null);
    const [hasShiftToday, setHasShiftToday] = useState<boolean | null>(null);

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
    }, [sectionId]);

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
                emptyText="No completed tasks."
                keyExtractor={(task) => String(task.task_id)}
                refreshing={loading}
                onRefresh={() => { }}
                renderItem={(task) => (
                    <TouchableOpacity>
                        <View>
                            <Text style={{ fontWeight: "bold", color: Colors.darkTan }}>
                                {task.title}
                            </Text>
                            <Text style={{ color: Colors.gray }}>{task.due_date}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default CompletedTasks;
