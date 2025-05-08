import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';

export default function Chat() {

  return (

    <DefaultView backgroundColor={Colors.white}>


      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>


        { /* Chat Header */ }
        <View style={{ width: '100%', paddingTop: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderColor }}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10 }}>
            Chat
          </Text>
        </View>
        
        {/* Temporary Content */}
        <DefaultScrollView>

          <Text>WIP</Text>

          
        </DefaultScrollView>


      </View>


    </DefaultView>

  )
};
