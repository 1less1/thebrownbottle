// Shadow Card

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
    alignItems: undefined,
    backgroundColor: 'white', // Default background, can be overridden
    paddingVertical: 10,
    paddingHorizontal: 8,

    //Border
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 14,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 3,
  },
  
});

export default Card;

