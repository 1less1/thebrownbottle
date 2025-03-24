import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';

export default function Chat() {
  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: Colors.white }}>
      
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.borderColor}}>
        <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10}}>
                Chat
            </Text>
     </View>
    
    
    <DefaultView>
      <Text>Hello, the chat will be here</Text>
    </DefaultView>
    </View>
)};
