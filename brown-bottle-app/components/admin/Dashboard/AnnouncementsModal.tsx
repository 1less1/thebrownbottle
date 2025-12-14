import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import { User } from '@/utils/SessionContext';
import { insertAnnouncement } from '@/routes/announcement';


interface ModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const AnnouncementsModal: React.FC<ModalProps> = ({ visible, onClose, user }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const [selectedRole, setSelectedRole] = useState<number | null>(1);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const MAX_CHARS = 500;

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedRole(1);
  };


  const handlePost = async () => {
    if (!title.trim() || !description.trim() || selectedRole === null) {
      alert("Please fill in both Title and Description!");
      return;
    }

    try {
      await insertAnnouncement({
        author_id: Number(user.employee_id),
        title: title,
        description: description,
        role_id: selectedRole
      });
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

    <ModularModal visible={visible} onClose={onClose} scroll={false}>

      {/* Header */}
      <Text style={GlobalStyles.modalTitle}>New Announcement</Text>

      {/* Announcement Form (Scrollable)*/}
      <View style={[styles.formContainer, { maxHeight: HEIGHT * 0.45 }]}>

        <ScrollView>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={[GlobalStyles.input, { marginBottom: 15 }]}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={(text) => {
              if (text.length <= MAX_CHARS) {
                setDescription(text);
              }
            }}
            multiline
            numberOfLines={4}
            style={[GlobalStyles.input, { marginBottom: 5 }]}
          />
          <Text style={{ color: Colors.gray, marginBottom: 10 }}>
            {description.length}/{MAX_CHARS}
          </Text>

          <View style={{ marginBottom: 10 }}>
            <RoleDropdown
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
              labelText="Assign To:"
              usePlaceholder={false}
            />
          </View>

        </ScrollView>

      </View>

      <View style={GlobalStyles.buttonRowContainer}>
        <ModularButton
          text="Post"
          textStyle={{ color: 'white' }}
          style={[GlobalStyles.submitButton, { flex: 1 }]}
          onPress={handlePost}
        />

        <ModularButton
          text="Cancel"
          textStyle={{ color: 'gray' }}
          style={[GlobalStyles.cancelButton, { flex: 1 }]}
          onPress={handleClose}
        />
      </View>

    </ModularModal >

  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
    marginTop: 10,
  },
});

export default AnnouncementsModal;
