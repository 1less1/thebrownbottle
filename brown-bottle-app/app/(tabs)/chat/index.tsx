import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';

export default function Chat() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (

    <DefaultView>


      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>


        { /* Chat Header */ }
        <View style={{ width: '100%', paddingTop: 40, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderColor }}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10 }}>
            Chat
          </Text>
        </View>
        
        {/* Temporary Content */}
        <DefaultScrollView>

          {/* Temporary Content */}
          <Text>This will be the most GOAT chat of all time!</Text>
          
        </DefaultScrollView>


      </View>


    </DefaultView>

  )
};
