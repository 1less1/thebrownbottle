
import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '@/components/Card';
import CircularImage from '@/components/CircularImage';
import { Ionicons } from '@expo/vector-icons';


export default function Profile() {
  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: Colors.white }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.borderColor}}>
      </View>
    
    <DefaultView>

      {/* Task List */}
      <View style={{ width:'85%', margin: 20 }}>
        <Card style={styles.profileCard}>

      {/* Settings button later on */}
        <View style={{alignItems:"flex-end"}}>
          <Ionicons name="settings" size={30} color="gray" style={{marginBottom: 8}} />
          </View>
          
          <TouchableOpacity>
            <View style={{alignItems: 'center', margin: 20}}>
              <CircularImage size={100} />
            </View>
            </TouchableOpacity>

          <Text style={styles.profileCardText}>John Doe</Text>
          <Text style={{textAlign:"center", marginTop:10}}>Server</Text>
        </Card>
      </View>

      {/* This week */}
      <View style={{ marginTop: 10, width: '85%', marginBottom: 10 }}>
          <Text style={{textAlign:'left', fontSize: 20, color: 'black', fontWeight: 'bold', marginBottom: 10 }}>
           This week
          </Text>

        <Card style={styles.progressCard}>
          <Text style={{fontWeight:"bold", fontSize:20}}>6.5 Hours</Text>
          <Text>some more info</Text>
          </Card>
      </View>

      {/* Other Stuff */}
      <View style={{ marginTop: 10, width: '85%' }}>
          <Text style={{textAlign:'left', fontSize: 20, color: 'black', fontWeight: 'bold', marginBottom: 10 }}>
           Recent Activity
          </Text>
      
          </View>
    
    </DefaultView>
    </View>

  )
};


const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 8,
    height: 300,
  },
  profileCardText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 8,
  },
  

})
