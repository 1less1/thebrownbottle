import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';

export default function TimeOff() {
  return (
    <View>
      
      <View style={{ marginTop: 20, width:'85%' }}>
        <View style={{alignSelf:'flex-start'}}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: 'black', }}>
              time off stuff
          </Text>
        </View>
      </View>

    </View>
)};
