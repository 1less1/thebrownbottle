import { StyleSheet, ActivityIndicator, View, Text, ActivityIndicatorProps, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

interface LoadingCircleProps {
  size?: ActivityIndicatorProps['size'];
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const LoadingCircle: React.FC<LoadingCircleProps> = ({
  size = 'large',
  color = Colors.gray, // default fallback color
  style = styles.statusContainer,
}) => {
  return (

    <View style={style}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.statusText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  statusText: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 12,
    marginTop: 5,
  },
});

export default LoadingCircle;
