import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from '@/components/modular/Card';
import LoadingCircle from '@/components/modular/LoadingCircle';

import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';
import SectionDropdown from '@/components/modular/dropdown/SectionDropdown';

import ModularListView from "@/components/modular/ModularListView";
import RecurringTaskistItem from '@/components/admin/Tasks/Templates/RecurringTaskListItem';

import EditTask from '@/components/admin/Tasks/EditTask';

import { getRecurringTask, deleteRecurringTask } from '@/routes/recurring_task';
import { RecurringTask, GetRecurringTask } from '@/types/iRecurringTask';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from "@/utils/SessionContext";
import { DropdownOption, DateSortType, YesNoSortType } from "@/types/iDropdown";

const activeDropdownOptions: DropdownOption<number>[] = [
    { key: "Active", value: 0 },
    { key: "Completed", value: 1 }
]

const dateDropdownOptions: DropdownOption<string>[] = [
    { key: "Newest Date", value: "Newest" },
    { key: "Oldest Date", value: "Oldest" }
];

interface Props {
    parentRefresh?: number;
    onRefreshDone?: () => void;
}

const AdminRecurringTasks: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;
    const cardHeight = isMobile ? HEIGHT * 0.5 : HEIGHT * 0.53;

    const { user } = useSession();
    const { confirm } = useConfirm();

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
    const [selectedTask, setSelectedTask] = useState<RecurringTask | null>(null);

    const [editModalVisible, setEditModalVisible] = useState(false);

    const [sectionFilter, setSectionFilter] = useState<number | null>(null);
    const [timestampFilter, setTimestampFilter] = useState<DateSortType>("Newest");

    const openEditModal = (recurringTask: RecurringTask) => {
        setSelectedTask(recurringTask);
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        setSelectedTask(null);
    };

    const fetchRecurringTasks = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);

            const params: Partial<GetRecurringTask> = {
                section_id: sectionFilter as number,
                timestamp_sort: timestampFilter,
            };
            const data = await getRecurringTask(params);
            setRecurringTasks(data);

        } catch (error: any) {
            setError('Failed to fetch recurring tasks.');
            console.log('Failed to fetch recurring tasks', error.message);
        } finally {
            setLoading(false);
        }
    }, [sectionFilter, timestampFilter]);

    // Fetch recurring tasks on initialization and state update
    useEffect(() => {
        fetchRecurringTasks();
    }, [parentRefresh, localRefresh, fetchRecurringTasks]);


    const handleDelete = async (recurringTaskId: number) => {
        if (!user) return;

        // Confirmation Popup
        const ok = await confirm("Confirm Deletion", 
            "Are you sure you want to delete this recurring task?"
        );
        if (!ok) return;

        setLoading(true);

        try {
            await deleteRecurringTask(recurringTaskId);
            setLocalRefresh((prev) => prev + 1); // Trigger Refresh
        } catch (error: any) {
            console.log("Error deleting recurring task:" + error.message);
        } finally {
            setLoading(false);
        }
    }

    const actionButtons = (recurringTask: RecurringTask) => {
        return (
            <View style={styles.buttonRow}>
                {/* Edit Button */}
                <TouchableOpacity
                    style={[styles.editButton]}
                    onPress={() => openEditModal(recurringTask)}
                    disabled={loading}
                >
                    <Ionicons name="create-outline" size={20} color={Colors.blue} />
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                    style={[GlobalStyles.deleteButton, styles.deleteButton]}
                    onPress={() => handleDelete(recurringTask.recurring_task_id)}
                    disabled={loading}
                >
                    <Ionicons name="close-circle-outline" size={20} color={Colors.red} />
                </TouchableOpacity>

            </View>
        );
    };

    const renderTask = (recurringTask: RecurringTask) => {
        return (
            <RecurringTaskistItem
                recurringTask={recurringTask}
            >
                {actionButtons(recurringTask)}
            </RecurringTaskistItem>
        );
    };

    if (!user) {
        return (
            <Card style={{ height: cardHeight }}>
                <LoadingCircle size="small" />
            </Card>
        );
    }

    return (

        <Card style={{ height: cardHeight }}>

            {/* Filter Container*/}
            <View style={styles.filterContainer}>
                <SectionDropdown
                    selectedSection={sectionFilter}
                    onSectionSelect={(value) => setSectionFilter(value as number)}
                    usePlaceholder={true}
                    placeholderText="All Sections"
                    containerStyle={GlobalStyles.dropdownButtonWrapper}
                />

                <ModularDropdown
                    data={dateDropdownOptions}
                    onSelect={(value) => setTimestampFilter(value as DateSortType)}
                    selectedValue={timestampFilter}
                    usePlaceholder={false}
                    containerStyle={GlobalStyles.dropdownButtonWrapper}
                />
            </View>

            {/* Task Feed */}
            <ModularListView
                data={recurringTasks}
                loading={loading}
                error={error}
                emptyText="No recurring tasks found."
                //itemContainerStyle={{ backgroundColor: "white" }}
                renderItem={renderTask}
                keyExtractor={(item) => item.recurring_task_id}
            />


            {/* Edit Task Modal */}
            {selectedTask && (
                <EditTask
                    task={selectedTask as RecurringTask}
                    visible={editModalVisible}
                    onClose={closeEditModal}
                    onUpdate={() => setLocalRefresh(prev => prev + 1)}
                />
            )}


        </Card>

    );
};

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap",        // allow wrapping
        justifyContent: "space-between",
        gap: 10,                 // spacing between items
        marginVertical: 10,
    },

    // Buttons
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",   // pushes both buttons to the right
        alignItems: "center",
        marginTop: 5,
        gap: 10,
    },
    deleteButton: {
        flexShrink: 1,
        borderColor: Colors.borderRed,
        borderWidth: 1,
    },
    editButton: {
        flexShrink: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: Colors.bgBlue,
        borderColor: Colors.borderBlue,
        borderWidth: 1,
    },
});

export default AdminRecurringTasks;
