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
    borderRadius: 15,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 6,
  },
});

export default Card;

