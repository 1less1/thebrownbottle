import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons for the icon
import AnnouncementsModal from './AnnouncementsModal'; // Import the modal
import { User } from '@/utils/SessionContext'; // Import User type from SessionContext

interface AnnouncementProps {
  user: User; // Make sure to define `User` type properly, based on your session data structure
}

const Announcements: React.FC<AnnouncementProps> = ({ user }) => {
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
        <Ionicons name="notifications" size={30} color="black" style={styles.icon} />
        <Text style={styles.title}>Announcement</Text>
      </TouchableOpacity>

      {/* Modal component that appears when the content is clicked */}
      <AnnouncementsModal visible={modalVisible} onClose={toggleModal} />
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
    color: '#333',
  },
});

export default Announcements;