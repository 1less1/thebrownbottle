import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { format, startOfDay } from 'date-fns';
import { parseLocalDate } from '@/utils/Helper';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';
import AltCard from '@/components/modular/AltCard';
import LoadingCard from '@/components/modular/LoadingCard';
import ModularButton from '@/components/modular/ModularButton';
import ModularModal from '@/components/modular/ModularModal';
import UniversalDateTimePicker from '@/components/modular/UniversalDateTimePicker';
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
    
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

    // Handler receives a formatted date string
    // When setting selectedDate, normalize:
   const handleDateChange = (formattedDate: string) => {
        const newDate = parseLocalDate(formattedDate);
        console.log('Formatted Date Input:', formattedDate);
        console.log('Parsed Date:', newDate.toString());
        setSelectedDate(newDate);
    };

    // When calling API, convert to formatted string:
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    const [DTPModalVisible, setDTPModalVisible] = useState(false);
    const openDTPModal = () => {
        setDTPModalVisible(true);
    }
    const closeDTPModal = () => {
        setDTPModalVisible(false);
    }


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
            due_date: formattedDate,
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
                checkedTasks.map(taskId => updateTask(taskId, { complete: 0, last_modified_by: Number(user.user_id)}))
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

            <Text style={{ marginVertical: 10 }}>
                Selected Date: {format(selectedDate, 'yyyy-MM-dd')}
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
                            onPress={openDTPModal} // Gotta Change this to open the Date Time Picker!!!
                        />
                        
                        <ModularModal visible={DTPModalVisible} onClose={closeDTPModal}>
                            <View style={{ marginVertical: 10 }}>
                                <UniversalDateTimePicker
                                value={selectedDate}
                                mode="date"
                                onChange={handleDateChange}
                                />
                            </View>
                            <ModularButton
                                text="Close"
                                onPress={closeDTPModal}
                                style={{ marginBottom: 5 }}
                            />
                        </ModularModal>
                    

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
});

export default CompletedTasks;
