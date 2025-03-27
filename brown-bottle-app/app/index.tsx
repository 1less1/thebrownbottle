import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    backgroundColor: Colors.darkTan, // Dark Tan Button
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: 300,
  },
  buttonText: {
      color: 'black', 
      fontSize: 16, 
      fontWeight: 'bold'
  }
});

export default function LandingScreen() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.greyWhite);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );
  const router = useRouter();

  const isAdmin = true;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.greyWhite, // Greyish White Background
      }}>

    <View
      style={{
        alignItems: 'center',
        
      }}>

        <Image
        source={require('@/assets/images/brown_bottle_logo.jpg')} // Adjust the path to your image
        style={{ width: 150, height: 150, marginTop: 20}}
      />

      </View>

      
      { /* Normal Employee Login */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/(tabs)/home', params: {isAdmin: 'false'} })}>
          <Text style={styles.buttonText}>Employee Login</Text>
        </TouchableOpacity>
      </View>
      
      { /* Admin Login */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/(tabs)/home', params: {isAdmin: 'true'} })}>
          <Text style={styles.buttonText}>Admin Login</Text>
        </TouchableOpacity>
      </View>

    </View>




  );
  
}
