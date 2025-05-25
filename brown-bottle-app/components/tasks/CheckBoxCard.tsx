import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import AltCard from '@/components/modular/AltCard';

import { Task } from '@/types/api';

interface CheckBoxCardProps {
  task: Task;
  checked: boolean;
  onCheckChange: (taskId: number, checked: boolean) => void;
}

const LONG_PRESS_DURATION = 500; // ms, match delayLongPress

const CheckBoxCard: React.FC<CheckBoxCardProps> = ({ task, checked, onCheckChange, }) => {
  
  const [isPressed, setIsPressed] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;

  const toggleCheck = () => onCheckChange(task.task_id, !checked);

  const handlePressIn = () => {
    setIsPressed(true);
    // Animate fill width from 0 to 100% over LONG_PRESS_DURATION
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: LONG_PRESS_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    // Reset animation if press released early
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  // Interpolate fill width from 0% to 100%
  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (

    <TouchableOpacity
      onLongPress={toggleCheck}
      delayLongPress={LONG_PRESS_DURATION}
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >

      <AltCard style={styles.checkBoxCard}>
        {/* Animated fill overlay */}
        <Animated.View
          pointerEvents="none" // So it doesn't block touches
          style={[
            styles.fillOverlay,
            { width: fillWidth },
          ]}
        />

        <View style={styles.cardContent}>
          <Text style={[GlobalStyles.text, { flexShrink: 1 }]}>{task.title}</Text>
        </View>

        <Ionicons
          name={checked ? 'checkbox' : 'square-outline'}
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
        />

      </AltCard>

    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  checkBoxCard: {
    position: 'relative', // Needed for overlay absolute positioning
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
    overflow: 'hidden', // To clip the fill overlay
  },
  fillOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.lightTan,
    borderRadius: 10,
    zIndex: 0,
  },
  cardContent: {
    flexDirection: 'column',
    zIndex: 1,
  },
});

export default CheckBoxCard;
