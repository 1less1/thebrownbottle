import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import AltCard from './AltCard'; // Adjust the path if needed

interface LoadingCardProps {
  loadingText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
loadingText = 'Loading...',
  containerStyle,
}) => {
  
    return (
        
    <AltCard style={[styles.loadingContainer, containerStyle]}>
      <Text style={styles.loadingText}>{loadingText}</Text>
    </AltCard>

  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    height: 200,
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.gray,
  },
});

export default LoadingCard;
