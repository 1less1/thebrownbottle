import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';
import AltCard from '@/components/modular/AltCard';
import LoadingCard from '@/components/modular/LoadingCard';
import ModularButton from '@/components/modular/ModularButton';
import ModularModal from '@/components/modular/ModularModal';
import SectionDropdown from '@/components/SectionDropdown';
import TaskList from '@/components/tasks/TaskList';

import { getTasks, updateTask } from '@/utils/api/task';
import { getAllSections } from '@/utils/api/section';
import { User } from '@/utils/SessionContext';
import { Task, Section } from '@/types/iApi';

interface ActiveTasksProps {
    user: User
    sections: Section[]
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ user, sections }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);


    // Section Handling -------------------------------------------------------------

    // Need to add a default to the employee's current shift section_id 
    // Default fallback to the section_id=1 if they do not have a shift that day
    const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
    const [selectedSectionName, setSelectedSectionName] = useState<string>("Loading...");

    useEffect(() => {
        if (sections && sections.length > 0 && sections[0].section_name) {
            setSelectedSectionName(sections[0].section_name)
        }
    }, [sections]);

    const handleSectionSelect = (sectionId: number, sectionName: string) => {
        setSelectedSectionId(sectionId);
        setSelectedSectionName(sectionName);
    };

    // ------------------------------------------------------------------------------


    // Checked Task Tracking --------------------------------------------------------

    const [checkedTasks, setCheckedTasks] = useState<number[]>([]);
    const handleCheckChange = (taskId: number, isChecked: boolean) => {
        setCheckedTasks(prev => {
            if (isChecked) return [...prev, taskId];
            return prev.filter(id => id !== taskId);
        });
    };

    // Log when checkedTasks changes - **DEBUGGING**
    useEffect(() => {
        console.log('Checked task IDs:', checkedTasks);
    }, [checkedTasks]);

    // ------------------------------------------------------------------------------


    // Task Fetching ----------------------------------------------------------------

    const [taskData, setTaskData] = useState<Task[]>([]);
    // Fetch all Incomplete (complete=0) Active Tasks when sectionId changes
    const fetchIncompleteTasks = async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await getTasks({
                section_id: selectedSectionId,
                complete: 0,
                today: true,
            });
            setTaskData(data);
            setCheckedTasks([]);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncompleteTasks();
    }, [selectedSectionId]);

    // ------------------------------------------------------------------------------


    // Task Submitting --------------------------------------------------------------

    // Submit all "Checked" Tasks as Complete (complete=1)
    const handleSubmit = async () => {
        if (checkedTasks.length === 0) {
            alert("Please select at least one task to submit.");
            return;
        }

        try {
            // Update all checked tasks to complete = 1
            await Promise.all(
                checkedTasks.map(taskId => updateTask(taskId, { complete: 1, last_modified_by: Number(user.employee_id) }))
            );

            alert("Task(s) Submitted Successfully!");
            setSubmitModalVisible(false);
            setCheckedTasks([]); // Clear checked tasks

            // Refetch tasks for current section
            fetchIncompleteTasks();

        } catch (error) {
            console.error("Error Submitting Task(s):", error);
            alert("Error: Failed to Submit Task(s). Please try again.");
        }
    };

    // ------------------------------------------------------------------------------


    return (

        <View style={{ flex: 1, width: '100%' }}>

            <Text style={GlobalStyles.floatingHeaderText}>
                {selectedSectionName ? selectedSectionName : "Loading..."}
            </Text>

            <Card style={styles.container}>

                <View style={styles.scrollContainer}>

                    <ModularButton
                        text="Filter"
                        onPress={() => setFilterModalVisible(true)}
                        style={{ marginTop: 5, marginBottom: 10 }}
                    />

                    <ModularModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)}>
                        <SectionDropdown
                            selectedSectionId={selectedSectionId}
                            onSectionSelect={handleSectionSelect}
                            sections={sections} // Pass sections data from Parent
                            fetchSections={false}
                            labelText="Section:"
                        />
                        <ModularButton
                            text="Close"
                            onPress={() => setFilterModalVisible(false)}
                            style={{ marginTop: 5, marginBottom: 10 }}
                        />
                    </ModularModal>

                    <DefaultScrollView>
                        {loading ? (
                            <LoadingCard
                                loadingText="Loading tasks..."
                                textStyle={GlobalStyles.loadingText}
                            />
                        ) : error ? (
                            <LoadingCard
                                loadingText="Unable to load tasks!"
                                textStyle={GlobalStyles.errorText}
                            />
                        ) : (
                            <TaskList
                                tasks={taskData}
                                checkedTasks={checkedTasks}
                                onCheckChange={handleCheckChange}
                            />
                        )}
                    </DefaultScrollView>

                    <View style={styles.buttonRowContainer}>
                        <ModularButton
                            text="Submit"
                            textStyle={{ color: 'white' }}
                            style={GlobalStyles.submitButton}
                            onPress={() => setSubmitModalVisible(true)}
                        />
                    </View>

                    <ModularModal visible={submitModalVisible} onClose={() => setSubmitModalVisible(false)}>

                        <Text style={GlobalStyles.text}>Are you sure you want to submit the selected task(s) as complete?</Text>
                        <View style={styles.buttonRowContainer}>
                            <ModularButton
                                text="Yes"
                                textStyle={{ color: 'white' }}
                                style={GlobalStyles.submitButton}
                                onPress={handleSubmit}
                            />

                            <ModularButton
                                text="Cancel"
                                textStyle={{ color: 'gray' }}
                                style={GlobalStyles.cancelButton}
                                onPress={() => setSubmitModalVisible(false)}
                            />
                        </View>
                    </ModularModal>

                </View>

            </Card>

        </View>

    );
};

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
});

export default ActiveTasks;
