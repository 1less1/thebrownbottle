import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
}

type Group = 'all' | 'servers' | 'bartenders' | 'kitchen';

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ visible, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [checkedGroups, setCheckedGroups] = useState<Record<Group, boolean>>({
    all: false,
    servers: false,
    bartenders: false,
    kitchen: false,
  });

  const toggleCheck = (group: Group) => {
    setCheckedGroups((prev) => {
      const updatedGroups = { ...prev, [group]: !prev[group] };
  
      // If 'All Staff' is selected, uncheck and disable other checkboxes
      if (group === 'all') {
        if (updatedGroups.all) {
          updatedGroups.servers = false;
          updatedGroups.bartenders = false;
          updatedGroups.kitchen = false;
        }
      } else {
        // If any other group is selected, uncheck 'All' group
        if (Object.values(updatedGroups).some((val) => val === true)) {
          updatedGroups.all = false;
        }
      }
  
      return updatedGroups;
    });
  };
  

  const handleSubmit = () => {
    // Validate subject and message fields
    if (!subject || !message) {
      alert('Please fill in both subject and message!');
      return;
    }
  
    // Determine which groups to send the announcement to
    const selectedGroupNames = checkedGroups.all
      ? ['all']  // If 'all' is checked, only 'all' group is considered
      : Object.keys(checkedGroups).filter((group) => checkedGroups[group] && group !== 'all');
  
    // Debugging log to check subject, message, and groups
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Sending to:', selectedGroupNames.join(', '));
  
    // Close the modal after submission
    onClose();
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
              <Text style={styles.description}>This will be sent to staff members.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Announcement subject"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Type your announcement here..."
                  multiline
                  numberOfLines={4}
                  value={message}
                  onChangeText={setMessage}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Send to:</Text>
                <View style={styles.checkboxGrid}>
                  <TouchableOpacity onPress={() => toggleCheck('all')} activeOpacity={0.8} style={styles.checkboxCard}>
                    <Ionicons
                      name={checkedGroups.all ? 'checkbox' : 'square-outline'}
                      size={16}
                      color="black"
                    />
                    <Text style={styles.text}>All Staff</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => toggleCheck('servers')} activeOpacity={0.8} style={styles.checkboxCard}>
                    <Ionicons
                      name={checkedGroups.servers ? 'checkbox' : 'square-outline'}
                      size={16}
                      color="black"
                    />
                    <Text style={styles.text}>Servers</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => toggleCheck('bartenders')} activeOpacity={0.8} style={styles.checkboxCard}>
                    <Ionicons
                      name={checkedGroups.bartenders ? 'checkbox' : 'square-outline'}
                      size={16}
                      color="black"
                    />
                    <Text style={styles.text}>Bartenders</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => toggleCheck('kitchen')} activeOpacity={0.8} style={styles.checkboxCard}>
                    <Ionicons
                      name={checkedGroups.kitchen ? 'checkbox' : 'square-outline'}
                      size={16}
                      color="black"
                    />
                    <Text style={styles.text}>Kitchen</Text>
                  </TouchableOpacity>
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
  description: {
    fontSize: 14,
    color: Colors.gray,
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
    marginBottom: 0,
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
