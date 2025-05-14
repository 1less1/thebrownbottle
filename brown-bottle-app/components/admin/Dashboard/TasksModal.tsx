import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dayjs from 'dayjs';

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import SectionDropdown from '@/components/SectionDropdown';
import { User } from '@/utils/SessionContext'; // Import type: User
import { insertTask } from '@/utils/api/task';
import HorizontalCheckboxList from '@/components/modular/HorizontalCheckboxList';
import ModularModal from '@/components/modular/ModularModal';

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

      // Clear Form
      setTitle('');
      setDescription('');
      setDueDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
      setSelectedSectionId(1);

      onClose();
    } catch (error) {
      console.error("Error posting task:", error);
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

      <Text style={styles.modalTitle}>New Task</Text>
      
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
      />
      
      <TextInput placeholder="Due Date" value={due_date} onChangeText={setDueDate} style={styles.input} />
      <Text style={{ fontSize: 12, color: 'gray', marginBottom: 5 }}>Example: YYYY-MM-DD</Text>

      <SectionDropdown selectedSectionId={selectedSectionId} onSectionSelect={setSelectedSectionId} labelText="Assign To:" />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Pressable onPress={() => setIsRecurring(!isRecurring)} style={{ marginRight: 10 }}>
          <Ionicons
            name={isRecurring ? 'checkbox' : 'square-outline'}
            size={24}
            color={isRecurring ? Colors.selectedBox : Colors.unselectedBox}
          />
        </Pressable>
        <Text style={{ fontSize: 16 }}>Recurring Task</Text>
      </View>

      {isRecurring && (
        <View style={{ marginVertical: 5}}>
          <HorizontalCheckboxList
            labelText="Select Days:"
            optionMap={dayMappings}
            onChange={(recurrenceDays) => setRecurrenceDays(recurrenceDays)}
          />
        </View>
      )}

      <View style={styles.buttonRowContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAssign}>
          <Text style={styles.buttonText}>Assign</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
          <Text style={[styles.buttonText, { color: 'gray' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      

    </ModularModal>
  );
};

const styles = StyleSheet.create({
  ddContainer: {
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: Colors.inputBG,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    backgroundColor: Colors.buttonBG,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: Colors.cancelButtonBG,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default TasksModal;
