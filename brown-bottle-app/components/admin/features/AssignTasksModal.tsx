import React, { useState } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Colors } from '@/constants/Colors';

import { insertTask } from '@/utils/api/task';

interface AssignTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ visible, onClose }) => {
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  // Author is Temporary
  const [author, setAuthor] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');


  // Function that triggers when a new Task is submitted
  const handleSubmit = () => {
    if (!taskTitle || !taskDescription || !author || !assignee || !dueDate) {
      alert('Please fill in all fields!');
      return;
    }

    if (!isValidDate(dueDate)) {
      alert ('Not a valid date!')
      return;
    }

    insertTask(taskTitle, taskDescription, Number(author), Number(assignee), dueDate);
    console.log('Task Assigned:', { taskTitle, taskDescription, author, assignee, dueDate });
    onClose();
  };


  // Checks if inputted date is valid
  const isValidDate = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
  };


  // UI Code
  return (

    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>

            <View style={styles.modalContainer}>

               {/* Header and Close Button*/}
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
                    value={taskDescription} 
                    onChangeText={setTaskDescription} 
                  />
                </View>

                {/* Author */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Author</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Person assigning"
                    placeholderTextColor={Colors.gray}
                    value={author}
                    onChangeText={setAuthor}
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
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Colors.gray}
                    value={dueDate}
                    onChangeText={setDueDate}
                  />
                </View>

              </ScrollView>

              {/* Submit Button -> Triggers the handleSubmit() function */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Assign Task</Text>
              </TouchableOpacity>

            </View>

          </TouchableWithoutFeedback>
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
  defaultTasks: {
    backgroundColor:Colors.white,
    borderRadius: 8,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
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
    marginTop: 5,
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