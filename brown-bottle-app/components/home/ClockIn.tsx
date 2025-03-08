import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Card from '@/components/Card'; 
import { Colors } from '@/constants/Colors'; 
import ClockWidget from '@/components/home/ClockWidget';

const ClockInCard: React.FC = () => {

  // Not needed anymore since the state us handled by the ClockWidget Component!
  /*
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);

  const handlePress = () => {
    setIsClockedIn((prevState) => {
      const newState = !prevState;

      if (newState) {
        Alert.alert("Clocked In", "You have successfully clocked in!");
        console.log("Clocked In!");
      } else {
        Alert.alert("Clocked Out", "You have successfully clocked out!");
        console.log("Clocked Out!");
      }

      return newState;
    });
  };
  */

  return (
    <Card style={{ backgroundColor: Colors.darkTan, width: '100%', padding: 16, alignItems:'center' }}>

      {/* The ClockWidget Component has all of this code now! */}
      {/*
      <Text style={styles.regularText}>
        {isClockedIn ? "You're Clocked In" : "You're Not Checked In Yet"}
      </Text>

      <Text style={styles.timeText}>12:57pm</Text>

      <TouchableOpacity
        style={[styles.button, { marginTop: 10, width: '100%' }]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{isClockedIn ? 'Clock Out' : 'Clock In'}</Text>
      </TouchableOpacity>

      */}

      {/* ClockWidget Component - contains live clock and working clock in button with states */}
      
      <ClockWidget/>

    </Card>
  );
};

const styles = StyleSheet.create({
  timeText: {
    textAlign: 'center',
    fontSize: 36,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 25,
    fontWeight: 'bold',
  },
  regularText: {
    color: 'black',
    fontSize: 15,
    marginBottom: 5,
  },
});

export default ClockInCard;
