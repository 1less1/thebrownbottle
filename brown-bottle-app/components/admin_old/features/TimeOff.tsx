import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';
import Card from '@/components/modular/Card';
import { Ionicons } from '@expo/vector-icons';  

export default function TimeOff() {
  return (
    <View>
      
      <View style={{ marginTop: 20, }}>
        <View style={{alignSelf:'flex-start', width:'100%'}}>
          
        <Card style={style.timeRequestcard}>
          <View style={style.cardLeft}>
            <Text style={style.timeRequestName}>Mark Grayson</Text>
            <Text style={style.timeRequestDate}>9/13/2025</Text>
          </View>

          <View style={style.cardRight}>
            
            <TouchableOpacity style={style.approveButton}>
              <Ionicons name="checkmark-circle-outline" size={28}/>
            </TouchableOpacity>

            <TouchableOpacity style={style.rejectButton}>
            <Ionicons name="close" size={28}/>
            </TouchableOpacity>

            </View>
          </Card>


          <Card style={style.timeRequestcard}>
          <View style={style.cardLeft}>
            <Text style={style.timeRequestName}>Atom Eve</Text>
            <Text style={style.timeRequestDate}>5/26/2025</Text>
          </View>

          <View style={style.cardRight}>
            
            <TouchableOpacity style={style.approveButton}>
              <Ionicons name="checkmark-circle-outline" size={28} />
            </TouchableOpacity>

            <TouchableOpacity style={style.rejectButton}>
            <Ionicons name="close" size={28}/>
            </TouchableOpacity>

            </View>
          </Card>

          <Card style={style.timeRequestcard}>
          <View style={style.cardLeft}>
            <Text style={style.timeRequestName}>Dommy Ohlava</Text>
            <Text style={style.timeRequestDate}>7/01/2025</Text>
          </View>

          <View style={style.cardRight}>
            
            <TouchableOpacity style={style.approveButton}>
              <Ionicons name="checkmark-circle-outline" size={28}/>
            </TouchableOpacity>

            <TouchableOpacity style={style.rejectButton}>
            <Ionicons name="close" size={28}/>
            </TouchableOpacity>

            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // allows name + date to align at top
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 5,
    flexDirection: 'row',
  },
  timeRequestName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timeRequestDate: {
    fontSize: 14,
    color: 'gray',
  },
  approveButton: {
    backgroundColor: '#c8f7c5',
    padding: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  rejectButton: {
    backgroundColor: '#f7c5c5',
    padding: 6,
    borderRadius: 4,
  },
  
});