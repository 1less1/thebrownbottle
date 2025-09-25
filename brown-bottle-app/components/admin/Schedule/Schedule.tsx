import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';
import Spreadsheet from './SpreadSheet';
import HeaderView from './HeaderView';
import ExSpread from './ExSpread';

export default function Schedule() {

  return (

    <DefaultView backgroundColor={Colors.white}>
      <View style={{ flex: 1, backgroundColor: Colors.greyWhite, justifyContent:'center', alignItems:'center' }}>
        <HeaderView />

      <DefaultScrollView>
            <Spreadsheet />
            {/* <ExSpread /> */}
        </DefaultScrollView>

      </View>
    </DefaultView>

  )
};
