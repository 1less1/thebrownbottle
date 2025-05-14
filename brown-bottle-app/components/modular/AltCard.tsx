// NO Shadow Card

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors'; // Adjust this based on your project structure

interface AltCardProps {
  children: React.ReactNode; // Allows any valid React content inside the card
  style?: StyleProp<ViewStyle>; // Optional style prop to allow custom styles
}

const AltCard: React.FC<AltCardProps> = ({ children, style }) => {
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
    backgroundColor: Colors.lightTan, // Default background, can be overridden
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,

    // These Remove the default Shadow Aspect
    shadowColor: 'transparent',  // Remove shadow color (iOS)
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0, 
    shadowRadius: 0, 
    elevation: 0,  // Remove shadow on Android

  },
  
});

export default AltCard;
