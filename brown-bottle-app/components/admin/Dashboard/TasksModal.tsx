import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
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
import { insertTask } from '@/utils/api/task';

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
    // Check if all fields are filled and validate date format
    if (!title.trim() || !description.trim() || !due_date.trim() || selectedSectionId === -1) {
        alert("Please fill in Title, Description, and Due Date!");
        return;
    }

    if (!isValidDate(due_date)) {
        alert("Please enter the date in YYYY-MM-DD format.");
        return;
    }

    try {
      await insertTask(
      Number(user.user_id),
      title,
      description,
      selectedSectionId,
      due_date
      );
      alert("Task Posted Successfully!");
      console.log("Task Posted Succeddully!")

      // Clear Form
      setTitle('');
      setDescription('');
      setDueDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
      setSelectedSectionId(1);

      onClose();
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error: Failed to assign task. Please try again.");
    }
    };

    const handleClose = () => {
      setTitle('');
      setDescription('');
      setDueDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
      setSelectedSectionId(1);
      onClose();
    };

  return (

    <ModularModal visible={visible} onClose={onClose}>


      <Text style={GlobalStyles.modalTitle}>New Task</Text>
      
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={[GlobalStyles.input, {marginBottom: 15}]}  />
      
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[GlobalStyles.input, { marginBottom: 15, height: 100, textAlignVertical: 'top' }]}
      />
      
      <TextInput placeholder="Due Date" value={due_date} onChangeText={setDueDate} style={[GlobalStyles.input, {marginBottom: 5}]} />
      <Text style={{ fontSize: 12, color: 'gray', marginBottom: 15 }}>Example: YYYY-MM-DD</Text>

      <View style={{ marginBottom: 15}}>
        <SectionDropdown selectedSectionId={selectedSectionId} onSectionSelect={setSelectedSectionId} labelText="Assign To:" />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Pressable onPress={() => setIsRecurring(!isRecurring)} style={{ marginRight: 10 }}>
          <Ionicons
            name={isRecurring ? 'checkbox' : 'square-outline'}
            size={24}
            color={isRecurring ? Colors.selectedBox : Colors.unselectedBox}
          />
        </Pressable>
        <Text style={GlobalStyles.mediumText}>Recurring Task</Text>
      </View>

      {isRecurring && (
        <View style={{ marginBottom: 10}}>
          <HorizontalCheckboxList
            labelText="Select Days:"
            optionMap={dayMappings}
            onChange={(recurrenceDays) => setRecurrenceDays(recurrenceDays)}
          />
        </View>
      )}

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
