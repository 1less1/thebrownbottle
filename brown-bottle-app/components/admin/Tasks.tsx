import DefaultView from '@/components/DefaultView';
import { View, Text } from 'react-native';

export default function Task() {
  return (
    <DefaultView>
      
      <View style={{ marginTop: 10, width:'85%' }}>
        <View style={{alignSelf:'flex-start'}}>
          <Text style={{ textAlign: 'center', fontSize: 15, color: 'black', }}>
              The tasks will be here bruh
          </Text>
        </View>
      </View>

    </DefaultView>
)};