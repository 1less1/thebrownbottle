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
      StatusBar.setBackgroundColor(Colors.bgApp);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const dismissKeyboardIfMobile = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };
  return (

    <DefaultView backgroundColor={Colors.bgApp}>
      <TouchableWithoutFeedback onPress={dismissKeyboardIfMobile} >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgApp }}>

          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('@/assets/images/brownbottlelogo.png')}
              style={{ width: 200, height: 200}}
            />
          </View>


          <View style={{ alignItems: 'center'}}>
            <HandleLogin />
          </View>

        </View>
      </TouchableWithoutFeedback>
    </DefaultView>

  );

}

export default LandingScreen;

const styles = StyleSheet.create({
});
