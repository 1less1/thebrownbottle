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
import { User } from '@/utils/SessionContext';
import { Task } from '@/types/api';

interface CompletedTasksProps {
  user: User
}

const CompletedTasks: React.FC<CompletedTasksProps> = ( user ) => {

    // Need to add a default to the employee's current shift section_id 
    // Default fallback to the section_id=1 if they do not have a shift that day
    const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
    const [selectedSectionName, setSelectedSectionName] = useState<string>("");

    const handleSectionSelect = (sectionId: number, sectionName: string) => {
        setSelectedSectionId(sectionId);
        setSelectedSectionName(sectionName);
    };
    
    const [taskData, setTaskData] = useState<Task[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);


    const [checkedTasks, setCheckedTasks] = useState<number[]>([]);

    const handleCheckChange = (taskId: number, isChecked: boolean) => {
    setCheckedTasks(prev => {
        if (isChecked) return [...prev, taskId];
        return prev.filter(id => id !== taskId);
    });
    };

    // Log when checkedTasks changes
    useEffect(() => {
    console.log('Checked task IDs:', checkedTasks);
    }, [checkedTasks]);

    // Fetch Completed Tasks
    useEffect(() => {
        const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await getTasks({
            section_id: selectedSectionId,
            complete: 1, // Only complete tasks
            today: true, // All active tasks up to Today's date
            });
            setTaskData(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
        };

        fetchTasks();
    }, [selectedSectionId]);


    const handleSubmit = async () => {
        if (checkedTasks.length === 0) {
            alert('Please select at least one task to "uncheck".');
            return;
        }

        try {
            // Update all checked tasks to complete = 0
            await Promise.all(
            checkedTasks.map(taskId => updateTask(taskId, { complete: 0 }))
            );

            alert('Task(s) "Unchecked" Successfully!');
            setSubmitModalVisible(false);
            setCheckedTasks([]); // Clear checked tasks

            // Refetch tasks for current section
            setLoading(true);
            const data = await getTasks({
            section_id: selectedSectionId,
            complete: 1, // still complete tasks only
            today: true,
            });
            setTaskData(data);
            setLoading(false);

        } catch (error) {
            console.error('Error "Unchecking" Task(s):', error);
            alert('Error: Failed to "Uncheck" Task(s). Please try again.');
        }
    };

    return (
        <View style={{flex: 1, width: '100%'}}>

                <Text style={GlobalStyles.floatingHeaderText}>
                    {selectedSectionName || 'Section Tasks'}
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
                                labelText="Section:"
                            />
                            <ModularButton
                                text="Choose Date"
                                textStyle={{ color: 'black'}}
                                style={[
                                    GlobalStyles.submitButton, 
                                    {backgroundColor: 'white', borderColor: Colors.darkTan, borderWidth: 1, marginVertical: 10}
                                ]}
                                onPress={handleSubmit} // Gotta Change this to open the Date Time Picker!!!
                            />
                            <ModularButton
                            text="Close"
                            onPress={() => setFilterModalVisible(false)}
                            style={{ marginBottom: 5 }}
                            />
                        </ModularModal>

                        <DefaultScrollView>
                            {loading ? (
                                <LoadingCard
                                loadingText="Loading tasks..."
                                textStyle={GlobalStyles.loadingText}
                                containerStyle={{ height: 380 }}
                                />
                            ) : error ? (
                                <LoadingCard
                                loadingText="Unable to load tasks!"
                                textStyle={GlobalStyles.errorText}
                                containerStyle={{ height: 380 }}
                                />
                            ) : (
                                <TaskList
                                    tasks={taskData}
                                    checkedTasks={checkedTasks}
                                    onCheckChange={handleCheckChange}
                                />

                            )}
                        </DefaultScrollView>

                        <View style={styles.buttonRowContainer }>
                            <ModularButton
                                text="Submit"
                                textStyle={{ color: 'white'}}
                                style={GlobalStyles.submitButton}
                                onPress={() => setSubmitModalVisible(true)}
                            />
                        </View>

                        <ModularModal visible={submitModalVisible} onClose={() => setSubmitModalVisible(false)}>
                            
                            <Text style={GlobalStyles.text}>Are you sure you want to "uncheck" the task(s)?</Text>
                            <View style={styles.buttonRowContainer }>
                                <ModularButton
                                    text="Yes"
                                    textStyle={{ color: 'white'}}
                                    style={GlobalStyles.submitButton}
                                    onPress={handleSubmit}
                                />

                                <ModularButton
                                    text="Cancel"
                                    textStyle={{ color: 'gray'}}
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
    buttonRowContainer : {
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
});

export default CompletedTasks;
