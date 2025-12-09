import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import AnimatedTouchableWrapper from "./modular/AnimatedTouchable";

interface ProfileAvatarProps {
  imageUri?: string;      // Optional profile image URI
  fullName?: string;       // Full name to extract initials
  size?: number;          // Avatar size (default: 80)
  backgroundColor?: string;
  borderColor?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUri,
  fullName,
  size = 80,
  // 2. Destructure the prop and assign the default value
  backgroundColor = "rgba(255, 255, 255, 0.5)",
  borderColor = "rgba(255,255,255,0.9)"
}) => {

  // Function: extract initials from full name
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  const safeName = fullName ?? "";
  const initials = getInitials(safeName);


  return (
    <AnimatedTouchableWrapper>
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: backgroundColor, borderColor: borderColor }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <Text style={[styles.initialsText, { fontSize: size * 0.38 }]}>{initials}</Text>
        )}
      </View>
    </AnimatedTouchableWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },

  initialsText: {
    color: "black",
    fontWeight: "700",
  },
});

export default ProfileAvatar;
