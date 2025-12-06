import React, { useRef } from "react";
import { Platform, Pressable, Animated, StyleProp, ViewStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hoverScale?: number;
  pressScale?: number;
}

/**
 * This wrapper provides:
 * - Press down scale animation
 * - Hover scale animation (web only)
 * Used around reusable components like StatCard and List Items
 */
const AnimatedTouchableWrapper: React.FC<Props> = ({
  children,
  onPress,
  style,
  hoverScale = 1.03,
  pressScale = 0.95,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number, duration = 100) => {
    Animated.timing(scale, {
      toValue: value,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => animateTo(pressScale);
  const handlePressOut = () => animateTo(1);

  const handleHoverIn = () => {
    if (Platform.OS === "web") animateTo(hoverScale);
  };

  const handleHoverOut = () => {
    if (Platform.OS === "web") animateTo(1);
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedTouchableWrapper;
