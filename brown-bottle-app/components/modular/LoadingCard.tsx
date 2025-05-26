import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import AltCard from './AltCard'; // Adjust the path if needed

interface LoadingCardProps {
  loadingText?: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  loadingText = 'Loading...',
  textStyle,
  containerStyle,
}) => {
  
    return (
        
    <AltCard style={[styles.loadingContainer, containerStyle]}>
      <Text style={[styles.loadingText, textStyle]}>{loadingText}</Text>
    </AltCard>

  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
});

export default LoadingCard;
