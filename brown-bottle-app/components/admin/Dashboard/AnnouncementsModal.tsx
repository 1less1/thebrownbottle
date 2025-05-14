import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import { Colors } from '@/constants/Colors';
import RoleDropdown from '@/components/RoleDropdown';
import { User } from '@/utils/SessionContext'; // Import type: User

import ModularButton from '@/components/modular/ModularButton';

import { insertAnnouncement } from '@/utils/api/announcement';
import ModularModal from '@/components/modular/ModularModal';


interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const AnnouncementsModal: React.FC<AnnouncementModalProps> = ({ visible, onClose, user }) => {

  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  const handlePost = async () => {
    if (!title.trim() || !description.trim() || selectedRoleId === -1) {
        alert("Please fill in both Title and Description!");
        return;
    }

    try {
        await insertAnnouncement(
        Number(user.user_id),
        title,
        description,
        selectedRoleId
        );
        alert("Announcement Posted Successfully!")

        // Clear Form
        setTitle('');
        setDescription('');
        setSelectedRoleId(1);

        onClose();
    } catch (error) {
        console.error("Error posting announcement:", error);
        alert("Error: Failed to post announcement. Please try again.");
    }
  };

  const handleClose = () => {
      setTitle('');
      setDescription('');
      setSelectedRoleId(1);
      onClose();
  };

  return (
    
    <ModularModal visible={visible} onClose={onClose}>

      <Text style={styles.modalTitle}>New Announcement</Text>

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

      <View style={styles.ddContainer}>
          <RoleDropdown
          selectedRoleId={selectedRoleId}
          onRoleSelect={setSelectedRoleId}
          labelText="Assign To:"
          />
      </View>

      <View style={styles.buttonRowContainer }>
          <TouchableOpacity style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Post</Text>
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
  buttonRowContainer : {
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

export default AnnouncementsModal;
