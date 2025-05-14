import { ActivityIndicator, ActivityIndicatorProps, StyleProp, ViewStyle } from 'react-native';
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
  color = Colors.darkTan, // default fallback color
  style,
}) => {
  return (
    <ActivityIndicator size={size} color={color} style={style} />
  );
};

export default LoadingCircle;
