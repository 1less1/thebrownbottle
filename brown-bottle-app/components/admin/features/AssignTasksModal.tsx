import React, { useState } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface AssignTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ visible, onClose }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (!taskTitle || !taskDetails || !assignee || !dueDate) {
      alert('Please fill in all fields!');
      return;
    }

    console.log('Task Assigned:', { taskTitle, taskDetails, assignee, dueDate });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Assign New Task</Text>
              <Text style={styles.description}>This will be sent to staff members.</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              {/* Task Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Task Title</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Task title" 
                  placeholderTextColor={Colors.gray} 
                  value={taskTitle} 
                  onChangeText={setTaskTitle} 
                />
              </View>

              {/* Task Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput 
                  style={[styles.input, styles.textarea]} 
                  placeholder="Task details..." 
                  placeholderTextColor={Colors.gray} 
                  multiline 
                  numberOfLines={4} 
                  value={taskDetails} 
                  onChangeText={setTaskDetails} 
                />
              </View>

              {/* Assignee */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Assign To</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Assign to person"
                  placeholderTextColor={Colors.gray}
                  value={assignee}
                  onChangeText={setAssignee}
                />
              </View>

              {/* Due Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Due Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter due date"
                  placeholderTextColor={Colors.gray}
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </View>
            </ScrollView>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Assign Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    width: '95%',
    maxHeight: '80%',
    padding: 24,
  },
  header: {
    marginBottom: 16,
    position: 'relative',
  },
  
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  content: {
    paddingVertical: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.darkBrown,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    color: Colors.gray,
  },
});

export default AssignTaskModal;
