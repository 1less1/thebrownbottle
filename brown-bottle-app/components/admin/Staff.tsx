import DefaultView from '@/components/DefaultView';
import { View, Text } from 'react-native';

export default function Staff() {
  return (
    <DefaultView>
      
      <View style={{ marginTop: 10, width:'85%' }}>
        <View style={{alignSelf:'flex-start'}}>
          <Text style={{ textAlign: 'center', fontSize: 15, color: 'black', }}>
              The staff page will be here
          </Text>
        </View>
      </View>

    </DefaultView>
)};