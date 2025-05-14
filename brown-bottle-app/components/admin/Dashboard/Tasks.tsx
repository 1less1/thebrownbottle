import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/utils/SessionContext'; 
import TasksModal from '@/components/admin/Dashboard/TasksModal';

interface TasksProps {
  user: User;
}

const Tasks: React.FC<TasksProps> = ({ user }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
        {/* Touchable content */}
        <TouchableOpacity onPress={toggleModal} style={styles.content}>
        <Ionicons name="create" size={30} color="black" style={styles.icon} />
        <Text style={styles.title}>Assign Task</Text>
        </TouchableOpacity>

        {/* Modal component that appears when the content is clicked */}
        <TasksModal visible={modalVisible} onClose={toggleModal} user={user} />
    </View>
  );
};

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
    flexDirection: 'column',  
    padding: 15,  
    width: 150,  
    height: 150,  
    justifyContent: 'center',  
  },
  icon: {
    marginBottom: 8, 
  },
  title: {
    fontSize: 14,  
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Tasks;
