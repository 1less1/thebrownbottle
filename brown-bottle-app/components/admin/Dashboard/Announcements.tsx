import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import { User } from '@/utils/SessionContext'; 
import AnnouncementsModal from '@/components/admin/Dashboard/AnnouncementsModal';

interface AnnouncementProps {
  user: User;
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
          <Ionicons name="notifications" size={30} color="black" style={styles.icon} />
          <Text style={GlobalStyles.boldText}>Announcement</Text>
      </TouchableOpacity>

      {/* Modal component that appears when the content is clicked */}
      <AnnouncementsModal visible={modalVisible} onClose={toggleModal} user={user} />
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
});

export default Announcements;