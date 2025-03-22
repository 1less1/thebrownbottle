import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';

export default function Chat() {
  return (
    <DefaultView>
      
      <View style={{ marginTop: 20, width:'85%' }}>
        <View style={{alignSelf:'flex-start'}}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold' }}>
              Chat
          </Text>
        </View>
      </View>



    </DefaultView>
)};
