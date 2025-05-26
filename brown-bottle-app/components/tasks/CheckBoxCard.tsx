import React, { useState, useRef } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import AltCard from '@/components/modular/AltCard';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import { Task } from '@/types/api';
import { formatDATE } from '@/utils/Helper';

interface CheckBoxCardProps {
  task: Task;
  checked: boolean;
  onCheckChange: (taskId: number, checked: boolean) => void;
}

const LONG_PRESS_DURATION = 500; // ms, match delayLongPress

const CheckBoxCard: React.FC<CheckBoxCardProps> = ({
  task,
  checked,
  onCheckChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const toggleCheck = () => onCheckChange(task.task_id, !checked);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: LONG_PRESS_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      {/* Touchable Container */}
      <TouchableOpacity
        onPress={openModal}
        onLongPress={toggleCheck}
        delayLongPress={LONG_PRESS_DURATION}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ width: '100%' }}
      >
        <AltCard style={styles.checkBoxCard}>
          {/* Animated Fill Bar */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.fillOverlay,
              {
                transform: [{ scaleX: fillAnim }],
                transformOrigin: 'left',
              },
            ]}
          />

          {/* Card Content */}
          <View style={styles.cardContent}>
            <Text style={[GlobalStyles.text, { flexShrink: 1 }]}>
              {task.title}
            </Text>
          </View>

          <Ionicons
            name={checked ? 'checkbox' : 'square-outline'}
            size={24}
            color="black"
            style={{ marginLeft: 10, zIndex: 1 }}
          />
        </AltCard>
      </TouchableOpacity>

      {/* Modal */}
      <ModularModal visible={modalVisible} onClose={closeModal}>
        <View>
          <Text style={GlobalStyles.headerText}>Task Information</Text>

          <Text style={[GlobalStyles.text, { marginTop: 5 }]}>
            <Text style={[GlobalStyles.boldText, { color: Colors.blue }]}>
              Due Date:{' '}
            </Text>
              {formatDATE(task.due_date, 'weekday')}
          </Text>

          <Text style={[GlobalStyles.text, { marginTop: 5 }]}>
            <Text style={GlobalStyles.boldText}>Title: </Text>
            {task.title}
          </Text>

          <Text style={[GlobalStyles.text, { marginTop: 5 }]}>
            <Text style={GlobalStyles.boldText}>Description: </Text>
            {task.description}
          </Text>

          <Text style={[GlobalStyles.smallAltText, { marginTop: 5 }]}>
            Last Modified By: {task.last_modified_name}
          </Text>
        </View>

        <ModularButton text="Close" onPress={closeModal} style={{ marginVertical: 5 }} />
      </ModularModal>
    </>
    
  );
};

const styles = StyleSheet.create({
  checkBoxCard: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.lightTan,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 6,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  fillOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.lightTan,
    zIndex: 0,
  },
  cardContent: {
    flexDirection: 'column',
    zIndex: 1,
  },
});

export default CheckBoxCard;