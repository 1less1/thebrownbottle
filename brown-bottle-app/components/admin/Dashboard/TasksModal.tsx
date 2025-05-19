import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, TextComponent } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import SectionDropdown from '@/components/SectionDropdown';
import HorizontalCheckboxList from '@/components/modular/HorizontalCheckboxList';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import { User } from '@/utils/SessionContext'; // Import type: User
import { insertRecurringTask, insertTask } from '@/utils/api/task';

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);


interface TasksModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const TasksModal: React.FC<TasksModalProps> = ({ visible, onClose, user }) => {

  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to today's date
  
  const [isRecurring, setIsRecurring] = useState(false);
  const [start_date, setStartDate] =  useState(dayjs().format('YYYY-MM-DD')); // Default to today's date
  // end_date allowed to be NULL!
  const [end_date, setEndDate] = useState<string | null>(dayjs().add(1, 'day').format('YYYY-MM-DD')); // Default to tomorrow's date
  const [noEndDate, setNoEndDate] = useState(false);

  const dayMappings = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
  };

  const [recurrence_days, setRecurrenceDays] = useState<string[]>([]);

  const handleAssign = async () => {
    // Common checks for title, description, and section
    if (!title.trim() || !description.trim() || selectedSectionId === -1) {
      alert("Please fill in Title, Description, and select a Section!");
      return;
    }

    if (isRecurring) {
      // Validate start_date
      if (!start_date.trim()) {
        alert("Please fill in the Start Date.");
        return;
      }

      if (!isValidDate(start_date)) {
        alert("Please enter the start date in YYYY-MM-DD format.");
        return;
      }

      // Validate end_date only if noEndDate is false
      if (!noEndDate) {
        if (!end_date || !end_date.trim()) {
          alert("Please fill in the End Date or check 'No End Date'.");
          return;
        }
        if (!isValidDate(end_date)) {
          alert("Please enter the end date in YYYY-MM-DD format.");
          return;
        }

        if (dayjs(start_date).isAfter(dayjs(end_date))) {
          alert("Start Date cannot be after End Date.");
          return;
        }
      }

      // Validate recurrence days selection
      if (!recurrence_days || recurrence_days.length === 0) {
        alert("Please select at least one day for recurrence.");
        return;
      }
    } else {
      // Non-recurring task validation
      if (!due_date.trim()) {
        alert("Please fill in the Due Date.");
        return;
      }

      if (!isValidDate(due_date)) {
        alert("Please enter the due date in YYYY-MM-DD format.");
        return;
      }
    }

    try {
      if (isRecurring) {
        await insertRecurringTask(
          Number(user.user_id),
          title,
          description,
          selectedSectionId,
          recurrence_days,
          start_date,
          noEndDate ? null : end_date // pass null if noEndDate checked
        );
      } else {
        await insertTask(
          Number(user.user_id),
          title,
          description,
          selectedSectionId,
          due_date
        );
      }

      alert("Task Posted Successfully!");
      console.log("Task Posted Successfully!");

      // Clear Form
      setTitle('');
      setDescription('');
      setDueDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
      setSelectedSectionId(1);
      setRecurrenceDays([]);
      setStartDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
      setEndDate(dayjs().add(1, 'day').format('YYYY-MM-DD')); // Reset to tomorrow's date
      setIsRecurring(false);
      setNoEndDate(false); // Reset checkbox

      onClose();

    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error: Failed to assign task. Please try again.");
    }
  };

  const handleClose = () => {
    // Clear Form
    setTitle('');
    setDescription('');
    setDueDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
    setSelectedSectionId(1);
    setRecurrenceDays([]);
    setStartDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
    setEndDate(dayjs().add(1, 'day').format('YYYY-MM-DD')); // Reset to tomorrow's date
    setIsRecurring(false);


    onClose();
  };

  
  
  
  // User Interface Code ---------------------------------------------------------------------------------------
  return (

    <ModularModal visible={visible} onClose={onClose}>


      <Text style={GlobalStyles.modalTitle}>New Task</Text>
      
      {/* Title Input */}
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={[GlobalStyles.input, {marginBottom: 15}]}  />
      
      {/* Description Input */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[GlobalStyles.input, { marginBottom: 15, height: 100, textAlignVertical: 'top' }]}
      />
      
      {/* Due Date Input */}
      {!isRecurring && (
        <>
          <View style= {{ flexDirection: 'row' }}>
            <Text style={[GlobalStyles.inputLabelText, {alignSelf: 'center'}]}>Due Date: </Text>
            <TextInput placeholder="Enter Date" value={due_date} onChangeText={setDueDate} style={[GlobalStyles.input, {marginBottom: 5, width: '100%'}]} />
          </View>
          <Text style={[GlobalStyles.smallAltText, { marginBottom: 10 }]}>Example: YYYY-MM-DD</Text>
        </>
      )}

      {/* Section Dropdown */}
      <View style={{ marginBottom: 15}}>
        <SectionDropdown selectedSectionId={selectedSectionId} onSectionSelect={setSelectedSectionId} labelText="Assign To:" />
      </View>
      
      {/* Recurring Checkbox */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Pressable onPress={() => setIsRecurring(!isRecurring)} style={{ marginRight: 5 }}>
          <Ionicons
            name={isRecurring ? 'checkbox' : 'square-outline'}
            size={24}
            color={isRecurring ? Colors.selectedBox : Colors.unselectedBox}
          />
        </Pressable>
        <Text style={GlobalStyles.mediumText}>Recurring Task</Text>
      </View>

      {isRecurring && (
        <>
          <View style={{ marginBottom: 15}}>
            <HorizontalCheckboxList
              labelText="Select Days:"
              optionMap={dayMappings}
              onChange={(recurrenceDays) => setRecurrenceDays(recurrenceDays)}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            {/* Start Date Input */}
            <>
              <View style= {{ flexDirection: 'row' }}>
                <Text style={[GlobalStyles.inputLabelText, { width: 75}]}>Start Date: </Text>
                <TextInput placeholder="Enter Date" value={start_date} onChangeText={setStartDate} style={[GlobalStyles.input, {marginBottom: 5, flex: 1}]} />
              </View>
              <Text style={[GlobalStyles.smallAltText, { marginBottom: 10 }]}>Example: YYYY-MM-DD</Text>
            </>

            {!noEndDate && (          
              <>
                <View style= {{ flexDirection: 'row' }}>
                  <Text style={[GlobalStyles.inputLabelText, {width: 75}]}>End Date: </Text>
                  <TextInput placeholder="Enter Date" value={end_date ?? ''} onChangeText={setEndDate} style={[GlobalStyles.input, {marginBottom: 5, flex: 1}]} />
                </View>
                <Text style={[GlobalStyles.smallAltText, { marginBottom: 10 }]}>Example: YYYY-MM-DD</Text>
              </>
            )}

            {/* No End Date Checkbox */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Pressable onPress={() => { setNoEndDate(!noEndDate); setEndDate(null); }} style={{ marginRight: 5 }}>
                <Ionicons
                  name={noEndDate ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={noEndDate ? Colors.selectedBox : Colors.unselectedBox}
                />
              </Pressable>
              <Text style={GlobalStyles.mediumText}>No End Date</Text>
            </View>

          
          </View>
        </>
      )}


      {/* Assign and Cancel Buttons */}
      <View style={styles.buttonRowContainer }>
          <ModularButton
            text="Assign"
            textStyle={{ color: 'white'}}
            style={GlobalStyles.submitButton}
            onPress={handleAssign}
          />

          <ModularButton
            text="Cancel"
            textStyle={{ color: 'gray'}}
            style={GlobalStyles.cancelButton}
            onPress={handleClose}
          />
      </View>


    </ModularModal>

  );
};

const styles = StyleSheet.create({
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

export default TasksModal;
