import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors'; // Adjust this based on your project structure

interface CardProps {
  children: React.ReactNode; // Allows any valid React content inside the card
  style?: StyleProp<ViewStyle>; // Optional style prop to allow custom styles
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

// Default styles for the Card component
const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: Colors.yellowTan, // Default background, can be overridden
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Android shadow
  },
});

export default Card;

