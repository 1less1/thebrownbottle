import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ModularButtonProps {
  text?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;     // Optional override for button
  textStyle?: StyleProp<TextStyle>; // Optional override for button text
}

const ModularButton: React.FC<ModularButtonProps> = ({
  text = 'Press Me',
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    backgroundColor: Colors.darkTan,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default ModularButton;
