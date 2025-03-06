import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Import the fallback image correctly
const defaultProfilePic = require('../assets/images/generic_profile_pic.png');

interface CircularImageProps {
  imageUri?: string; // Optional image URL
  size?: number;
}

const CircularImage: React.FC<CircularImageProps> = ({ imageUri, size = 100 }) => {
  return (
    <View style={styles.circularContainer}>
      <Image
        source={imageUri ? { uri: imageUri } : defaultProfilePic} // Use the fallback image if no `imageUri` is provided
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#ccc', // Placeholder background color
  },
});

export default CircularImage;
