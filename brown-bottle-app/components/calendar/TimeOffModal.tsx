import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors'; 

import { Ionicons } from '@expo/vector-icons';  
import DefaultScrollView from '../DefaultScrollView';

interface TimeOffModalProps {
  visible: boolean;
  onClose: () => void;
}

const TimeOffModal: React.FC<TimeOffModalProps> = ({ visible, onClose }) => {
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    console.log('Time Off Request:', { reason, date });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        
        <View style={styles.overlay}>
          
          <TouchableWithoutFeedback>

            
            
            <View style={styles.modalContainer}>
              
              <View style={styles.header}>
                <Text style={styles.title}>Request Time Off</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color={Colors.white}/>
                </TouchableOpacity>
              </View>
              
              <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.content}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter date"
                      value={date}
                      onChangeText={setDate}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Reason</Text>
                    <TextInput
                      style={[styles.input, styles.textarea]}
                      placeholder="Enter reason"
                      multiline
                      numberOfLines={4}
                      value={reason}
                      onChangeText={setReason}
                    />
                  </View>
                </View>

              </ScrollView>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Request</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(5px)', // Adds a blur effect
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    width: '95%',
    maxHeight: '80%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 }, // Adjusted for top shadow
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // Shadow for Android
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
    top: -10,
    right: -10,
    backgroundColor: Colors.darkBrown,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
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

export default TimeOffModal;
