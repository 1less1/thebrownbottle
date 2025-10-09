import { View, Text, StatusBar, StyleSheet, TouchableWithoutFeedback, Image, Keyboard, Platform } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';

import HandleLogin from '@/components/auth/HandleLogin'

const LandingScreen = () => {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.greyWhite);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const dismissKeyboardIfMobile = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };
  return (

    <DefaultView backgroundColor={Colors.greyWhite}>
      <TouchableWithoutFeedback onPress={dismissKeyboardIfMobile} >
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
      </TouchableWithoutFeedback>
    </DefaultView>

  );
  
}

export default LandingScreen;

const styles = StyleSheet.create({
});
