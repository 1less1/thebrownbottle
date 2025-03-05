import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

import { CircularImage } from '@/components';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.yellowTan,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black', 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  box: {
    alignItems: 'center',
    backgroundColor: Colors.yellowTan,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5, 
    elevation: 5, 
  }
});

// This is the "Home Page" when the (tabs) directory is loaded on the stack 
export default function HomeScreen() {

  return (
  
    <View
      style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.greyWhite,
        height: '100%',
        width: '100%',
      }}>


      {/* Top Strip - Box */}
      <View style={{backgroundColor: Colors.darkTan, position: 'absolute', top: 0, height: 140, width: '100%'}} />

      <View style={{marginTop: 60}}>
        <CircularImage size={120} />
      </View>
      


      { /* Clock In View */}
      <View style={{ margin: 20, width: '90%' }}>

        <Text
          style={{
            textAlign: 'left',
            fontSize: 16,
            color: 'black',
          }}>
          Today
        </Text>

        <View style={[styles.box, {backgroundColor: Colors.darkTan, width: '100%',}]}>
        
          <Text
            style={{
              textAlign: 'center',
              fontSize: 40,
              color: 'black',
              fontWeight: 'bold'
            }}>
            12:57pm
          </Text>

        <TouchableOpacity style={[styles.button, {marginTop: 6, width: '90%'}]} onPress={() => console.log("Clocked In!")}>
          <Text style={styles.buttonText}>CLOCK IN</Text>
        </TouchableOpacity>

        </View>

      </View>


      <View style={{ width: '90%' }}>

        <Text
          style={{
            textAlign: 'left', // ✅ Left-align text inside its container
            fontSize: 16,
            color: 'black',
          }}>         
          Announcements
        </Text>

        <View style={[styles.box, {backgroundColor: Colors.darkTan, paddingHorizontal: 10,}]}>

          <View style={[styles.box, {backgroundColor: Colors.lightTan, width: '90%'}]}>
            <Text>thebrownbottle.com is prone to IDOR. #normalizecybercriminals</Text>
          </View>

          <View style={[styles.box, {backgroundColor: Colors.lightTan, width: '90%', marginTop: 6}]}>
            <Text>Aaryn got his arm slammed in a stove. #bitchmoves</Text>
          </View>

          <View style={[styles.box, {backgroundColor: Colors.lightTan, width: '90%', marginTop: 6}]}>
            <Text>Who is going to the Banana Bar Crawl? I think Brad is. Get over here boi. #peelsonwheels</Text>
          </View>

        </View>

      </View>

    </View>

  );
}


