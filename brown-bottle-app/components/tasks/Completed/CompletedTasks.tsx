import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { parseLocalDate } from '@/utils/Helper';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';
import AltCard from '@/components/modular/AltCard';
import LoadingCard from '@/components/modular/LoadingCard';
import ModularButton from '@/components/modular/ModularButton';
import ModularModal from '@/components/modular/ModularModal';
import UniversalDatePicker from '@/components/modular/UniversalDatePicker';
import SectionDropdown from '@/components/SectionDropdown';
import TaskList from '@/components/tasks/TaskList';

import { getTasks, updateTask } from '@/utils/api/task';
import { getAllSections } from '@/utils/api/section';
import { User } from '@/utils/SessionContext';
import { Task, Section} from '@/types/api';


interface CompletedTasksProps {
  user: User
  sections: Section[]
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ user, sections}) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const closeFilterModal = () => {
        setFilterModalVisible(false);
    };
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


    // Date Time Handling -----------------------------------------------------------
    
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

    // Handler receives a formatted date string (YYYY-MM-DD)
    const handleDateChange = (formattedDate: string) => {
    const parsed = dayjs(formattedDate, 'YYYY-MM-DD', true); // strict parsing
    if (parsed.isValid()) {
        // Normalize to start of day and format back to string
        setSelectedDate(parsed.startOf('day').format('YYYY-MM-DD'));
    } else {
        console.warn('Invalid date string:', formattedDate);
        }
    };
    
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const toggleDatePicker = () => {
        setDatePickerVisible((prev) => !prev);
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
    // Fetch all Incomplete (complete=1) Active Tasks when sectionId changes
    const fetchCompleteTasks = async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await getTasks({
            section_id: selectedSectionId,
            complete: 1,
            due_date: selectedDate,
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
        fetchCompleteTasks();
    }, [selectedSectionId, selectedDate]);

    // ------------------------------------------------------------------------------


    // Task Submitting --------------------------------------------------------------

    // Submit all "Checked" Tasks as Incomplete (complete=0)
    const handleSubmit = async () => {
        if (checkedTasks.length === 0) {
            alert('Please select at least one task to mark as incomplete.');
            return;
        }

        try {
            // Update all checked tasks to complete = 0
            await Promise.all(
                checkedTasks.map(taskId => updateTask(taskId, { complete: 0, last_modified_by: Number(user.employee_id)}))
            );

            alert('Task(s) marked as Incomplete Successfully!');
            setSubmitModalVisible(false);
            setCheckedTasks([]); // Clear checked tasks

            // Refetch tasks for current section
            await fetchCompleteTasks();;

        } catch (error) {
            console.error('Error marking Task(s) as Incomplete:', error);
            alert('Error: Failed to mark Task(s) as Incomplete. Please try again.');
        }
    };
    
    // ------------------------------------------------------------------------------


    return (
        
        <View style={{flex: 1, width: '100%'}}>

            <Text style={GlobalStyles.floatingHeaderText}>
                {selectedSectionName ? selectedSectionName : "Loading..."}
            </Text>             
            
            <Card style={styles.container}>
            
                <View style={styles.scrollContainer}>

                    <View style={styles.filterRowContainer}>
                        <ModularButton
                            text="Filter"
                            onPress={() => setFilterModalVisible(true)}
                            style={{ flexGrow: 1, flexShrink: 1, }}
                        />
                        <View style={{ paddingRight: 5}}>
                            <Text style={GlobalStyles.altText}>
                                <Text style={GlobalStyles.boldText}>Selected Date: </Text>
                                {selectedDate}
                            </Text>
                        </View>
                    </View>

                    <ModularModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)}>
                        <SectionDropdown
                            selectedSectionId={selectedSectionId}
                            onSectionSelect={handleSectionSelect}
                            sections={sections} // Pass sections from parent
                            fetchSections={false}  
                            labelText="Section:"
                        />

                        
                        <ModularButton
                            text="Choose Date"
                            textStyle={{ color: 'black'}}
                            style={[
                                GlobalStyles.submitButton, 
                                {backgroundColor: 'white', borderColor: Colors.darkTan, borderWidth: 1, marginVertical: 10}
                            ]}
                            onPress={toggleDatePicker}
                        />
                        
                        
                        {datePickerVisible && (
                            <View style={{ marginBottom: 10 }}>
                                <UniversalDatePicker
                                    dateString={selectedDate}
                                    onChange={(dateString) => {
                                        handleDateChange(dateString);
                                    }}
                                />
                            </View>
                        )}

                    

                        <ModularButton
                            text="Close"
                            onPress={closeFilterModal}
                            style={{ marginBottom: 5 }}
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

                    <View style={styles.buttonRowContainer }>
                        <ModularButton
                            text="Submit"
                            textStyle={{ color: 'white'}}
                            style={GlobalStyles.submitButton}
                            onPress={() => setSubmitModalVisible(true)}
                        />
                    </View>

                    <ModularModal visible={submitModalVisible} onClose={() => setSubmitModalVisible(false)}>
                        
                        <Text style={GlobalStyles.text}>Are you sure you want mark the following task(s) as incomplete?</Text>
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
    filterRowContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginTop: 5, 
        marginBottom: 10,
        gap: 10,
    },
});

export default CompletedTasks;
