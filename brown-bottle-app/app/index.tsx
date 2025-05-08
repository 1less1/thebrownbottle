import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';

import HandleLogin from '@/components/HandleLogin'

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

  return (

    <DefaultView backgroundColor={Colors.greyWhite}>

    
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.greyWhite }}>

        <View style={{ alignItems: 'center' }}>
          <Image
          source={require('@/assets/images/brown_bottle_logo.jpg')}
          style={{ width: 150, height: 150, marginTop: 20}}
          />
        </View>


        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <HandleLogin/> 
        </View>

      </View>

    </DefaultView>

  );
  
}
