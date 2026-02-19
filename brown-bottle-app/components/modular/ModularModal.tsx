import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Platform, StyleProp, ViewStyle } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

interface ModularModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ModularModal: React.FC<ModularModalProps> = ({ visible, onClose, children, scroll = true, style }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      
      {/* 1. Main centering container */}
      <View style={styles.overlay}>
        
        {/* 2. Dismiss background */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>

        {/* 3. The Modal Card */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          // keyboardVerticalOffset helps fine-tune the gap between keyboard and input
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={[styles.modalContainer, style]}
        >
          {scroll ? (
            <ScrollView 
              style={{ flexShrink: 1 }}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            <View style={styles.scrollContent}>
              {children}
            </View>
          )}
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
    width: '85%',
    maxWidth: 800 ,
    backgroundColor: 'white',
    borderRadius: 15,
    maxHeight: '85%',
    elevation: 5,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 0, // Modal content defines height
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ModularModal;
