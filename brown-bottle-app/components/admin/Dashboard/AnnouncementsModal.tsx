import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import RoleDropdown from '@/components/RoleDropdown';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import { User } from '@/utils/SessionContext';
import { insertAnnouncement } from '@/utils/api/announcement';


interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const AnnouncementsModal: React.FC<AnnouncementModalProps> = ({ visible, onClose, user }) => {

  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  
  const handleRoleSelect = (roleId: number, roleName: string) => {
      setSelectedRoleId(roleId);
      setSelectedRoleName(roleName);
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedRoleId(1);
    setSelectedRoleName('');
  };


  const handlePost = async () => {
    if (!title.trim() || !description.trim() || selectedRoleId === -1) {
      alert("Please fill in both Title and Description!");
      return;
    }

    try {
      await insertAnnouncement(
        Number(user.employee_id),
        title,
        description,
        selectedRoleId
      );
      alert("Announcement Posted Successfully!")

      resetForm();

      onClose();
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Error: Failed to post announcement. Please try again.");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    
    <ModularModal visible={visible} onClose={onClose}>

      <Text style={GlobalStyles.modalTitle}>New Announcement</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={[GlobalStyles.input, { marginBottom: 15}]}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[GlobalStyles.input, { marginBottom: 15, height: 100, textAlignVertical: 'top' }]}
      />

      <View style={{ marginBottom: 10 }}>
        <RoleDropdown
        selectedRoleId={selectedRoleId}
        onRoleSelect={handleRoleSelect}
        labelText="Assign To:"
        />
      </View>

      <View style={styles.buttonRowContainer }>
        <ModularButton
          text="Post"
          textStyle={{ color: 'white'}}
          style={GlobalStyles.submitButton}
          onPress={handlePost}
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
  buttonRowContainer : {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

export default AnnouncementsModal;
