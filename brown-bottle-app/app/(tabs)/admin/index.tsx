import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';

export default function Admin() {
  return (
    <DefaultView>
      <View>
      <Text style={{ textAlign: 'center', fontSize: 35, color: 'black', fontWeight: 'bold', marginTop: 20 }}>
            Admin 
          </Text>   
      </View>



    </DefaultView>
)};
