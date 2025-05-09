import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { Colors } from '@/constants/Colors';
import SectionDropdown from '@/components/SectionDropdown';
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

  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to today's date

  const handleAssign = async () => {
    // Check if all fields are filled and validate date format
    if (!title.trim() || !description.trim() || !due_date.trim() || selectedRoleId === -1) {
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
        selectedRoleId,
        due_date
      );
      alert("Task Posted Successfully!");

      // Clear Form
      setTitle('');
      setDescription('');
      setDueDate(dayjs().format('YYYY-MM-DD')); // Reset to today's date
      setSelectedRoleId(1);

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
    setSelectedRoleId(1);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>New Task</Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          />

          {/* Due Date Input */}
          <TextInput
            placeholder="Due Date"
            value={due_date}
            onChangeText={setDueDate}
            style={styles.input}
          />
          <Text style={{ fontSize: 12, color: 'gray', marginBottom: 10 }}>
            Example: YYYY-MM-DD
          </Text>

          <View style={styles.ddContainer}>
            <SectionDropdown
              selectedRoleId={selectedRoleId}
              onRoleSelect={setSelectedRoleId}
              labelText="Assign To:"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleAssign}>
              <Text style={styles.buttonText}>Assign</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, { color: 'gray' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ddContainer: {
    marginBottom: 5,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TasksModal;
