import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { GlobalStyles } from "@/constants/GlobalStyles";

interface BadgeProps {
  text: string;
  badgeStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Badge({
  text,
  badgeStyle,
  textStyle,
}: BadgeProps) {
  return (
    <View style={[GlobalStyles.standardBadge, badgeStyle]}>
      <Text style={[GlobalStyles.standardBadgeText, textStyle]}>
        {text}
      </Text>
    </View>
  );
}
