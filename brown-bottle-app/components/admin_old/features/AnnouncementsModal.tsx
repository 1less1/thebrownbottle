import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { getAllRoles } from '@/utils/api/role';
import { insertAnnouncement } from '@/utils/api/announcement';
import { Role } from '@/types/api';

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ visible, onClose }) => {
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);  // Using the imported Role type
  const [checkedRoles, setCheckedRoles] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
        const initialChecked: Record<number, boolean> = {};
        data.forEach((role) => {
          initialChecked[role.role_id] = false;
        });
        setCheckedRoles(initialChecked);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    })();
  }, []);

  const toggleRole = (roleId: number) => {
    setCheckedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  const handleSubmit = async () => {
    if (!Title || !Description) {
      alert('Please fill in both Title and Description!');
      return;
    }

    const selectedRoleIds: number[] = Object.entries(checkedRoles)
      .filter(([_, checked]) => checked)
      .map(([id]) => Number(id));

    try {
      // Submit the announcement to the backend
      const result = await insertAnnouncement(1, Title, Description, selectedRoleIds); 
      console.log('Announcement inserted successfully:', result);
      alert('Announcement sent successfully!');
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error inserting announcement:', error);
      alert('Failed to send the announcement.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Send Announcement</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Announcement Title"
                  value={Title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Type your announcement here..."
                  multiline
                  numberOfLines={4}
                  value={Description}
                  onChangeText={setDescription}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Send to:</Text>
                <View style={styles.checkboxGrid}>
                  {roles.map((role) => (
                    <TouchableOpacity
                      key={role.role_id}
                      onPress={() => toggleRole(role.role_id)}
                      activeOpacity={0.8}
                      style={styles.checkboxCard}
                    >
                      <Ionicons
                        name={checkedRoles[role.role_id] ? 'checkbox' : 'square-outline'}
                        size={16}
                        color="black"
                      />
                      <Text style={styles.text}>{role.role_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send Announcement</Text>
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
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    padding: 6,
    margin: 6,
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 14,
    color: 'black',
    marginLeft: 8,
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
});

export default AnnouncementModal;
