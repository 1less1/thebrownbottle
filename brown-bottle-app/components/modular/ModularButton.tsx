import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ModularButtonProps {
  text?: string;
  onPress: () => void;
  onLongPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;     // Optional override for button
  textStyle?: StyleProp<TextStyle>; // Optional override for button text
  enabled?: boolean;
}

const ModularButton: React.FC<ModularButtonProps> = ({
  text = 'Press Me',
  onPress,
  onLongPress,
  children,
  style,
  textStyle,
  enabled = true,
}) => {

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !!children && styles.iconButton,
        !enabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={800}
      disabled={!enabled}
    >

      <View style={styles.content}>
        {children ? (
          <>
            <Text style={[styles.spacerText, textStyle]}>{""}</Text>
            {children}
            <Text style={[styles.spacerText, textStyle]}>{""}</Text>
          </>
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{text}</Text>
        )}
      </View>
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
  iconButton: {
    paddingHorizontal: 15,   // ✅ less padding for icon-only buttons
  },
  content: {
    flexDirection: 'row',   // ✅ icon + text side by side
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacerText: {
    opacity: 0,          // invisible
    minWidth: 0,         // no horizontal space
    fontSize: 14,        // match your buttonText fontSize
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ModularButton;
