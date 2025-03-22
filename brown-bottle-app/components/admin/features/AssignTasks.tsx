import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons for the icon
import AssignTasksModal from './AssignTasksModal'; // Import the new modal for task assignment

export default function AssignTasks() {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      {/* This is the clickable content */}
      <TouchableOpacity onPress={toggleModal} style={styles.content}>
        {/* Icon and Text */}
        <Ionicons name="create" size={30} color="black" style={styles.icon} />
        <Text style={styles.title}>Assign Task</Text>
      </TouchableOpacity>

      {/* Modal component that appears when the content is clicked */}
      <AssignTasksModal visible={modalVisible} onClose={toggleModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'column',  // Stack the icon and text vertically
    padding: 15,  // Added more padding for a larger clickable area
    width: 150,  // Specify width to prevent squishing on smaller screens
    height: 150,  // Set a height to make it a reasonable size
    justifyContent: 'center',  // Center content vertically within the button
  },
  icon: {
    marginBottom: 8,  // Space between icon and text
  },
  title: {
    fontSize: 16,  
    fontWeight: 'bold',
    color: '#333',
  },
});
