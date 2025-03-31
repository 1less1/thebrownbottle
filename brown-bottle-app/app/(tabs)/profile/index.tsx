import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import DefaultView from '@/components/DefaultView';
import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/Card';
import CircularImage from '@/components/CircularImage';



export default function Profile() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (

    <DefaultView backgroundColor={Colors.white}>


      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>

        <View style={{ width: '100%', paddingTop: 20, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderColor }}>
            <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10 }}>
              {/* No Text Here - Keeps Same Spacing for Top Bar as other Screens! */}
            </Text>
        </View>


        <DefaultScrollView>
          
          {/* Main Profile View */}
          <View style={{ width:'85%', marginVertical: 20 }}>

            <Card style={styles.profileCard}>

              {/* Settings button for later on */}
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
          <View style={{ marginVertical: 10, width: '85%' }}>
            <Text style={{ textAlign: 'left', fontSize: 18, color: 'black', fontWeight: "bold", marginBottom: 8 }}>This Week</Text>

              <Card style={styles.progressCard}>
                <Text style={{fontWeight:"bold", fontSize:16}}>6.5 Hours</Text>
                <Text>some more info</Text>
              </Card>
          </View>


          {/* Filler Stuff */}
          <View style={{ width: '85%', marginBottom: 60 }}>

            <Text style={{ textAlign: 'left', fontSize: 18, color: 'black', fontWeight: "bold", marginBottom: 8 }}>Recent Activity</Text>
        
            <Card style={styles.progressCard}>
              <Text style={{ fontWeight:"bold", fontSize: 16 }}>Activity 1</Text>
              <Text>some more info</Text>
            </Card>

            <Card style={styles.progressCard}>
              <Text style={{ fontWeight:"bold", fontSize: 16 }}>Activity 2</Text>
              <Text>some more info</Text>
            </Card>

            <Card style={styles.progressCard}>
              <Text style={{ fontWeight:"bold", fontSize: 16 }}>Activity 3</Text>
              <Text>some more info</Text>
            </Card>

          </View>
          
        </DefaultScrollView>


      </View>


    </DefaultView>

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
    marginBottom: 15,
  },
  

})
