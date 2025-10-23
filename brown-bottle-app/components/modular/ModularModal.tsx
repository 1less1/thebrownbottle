import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import { Colors } from '@/constants/Colors';

interface ModularModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModularModal: React.FC<ModularModalProps> = ({ visible, onClose, children }) => {
  
  return (

    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Only dismiss keyboard when tapping outside modal content */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>


  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: '85%',
  },
  scrollView: {
    flexGrow: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ModularModal;
