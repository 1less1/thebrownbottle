import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';
import Card from '@/components/Card';

export default function TimeOff() {
  return (
    <View>
      
      <View style={{ marginTop: 20, }}>
        <View style={{alignSelf:'flex-start', width:'100%'}}>
          
          <Card style={style.timeRequestcard}>
            <Text style={style.timeRequestName}>
              Mark Grayson
              </Text>
            <Text style={style.timeRequestDate}>
              9/13/2025
            </Text>
          </Card>

          <Card style={style.timeRequestcard}>
          <Text style={style.timeRequestName}>
              Greg Heffley
              </Text>
            <Text style={style.timeRequestDate}>
              3/18/2025
            </Text>
          </Card>

          <Card style={style.timeRequestcard}>
          <Text style={style.timeRequestName}>
              Michael Meyers
              </Text>
            <Text style={style.timeRequestDate}>
              4/1/2025
            </Text>
          </Card>

        </View>
      </View>

    </View>
)};

const style = StyleSheet.create({
  timeRequestcard: {
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    
  },
  timeRequestName:{
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeRequestDate: {
    textAlign: 'left',
    padding: 5,
  },
});