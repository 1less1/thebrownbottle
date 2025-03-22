import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";

const ClockInWidget = () => {


    // Function that fetches the current time and formats it as "hours:minutes"
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        const ampm = hours < 12 ? 'AM' : 'PM'; // Correct AM/PM determination
        const hour12 = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hour12}:${formattedMinutes}${ampm}`;        
    };

    const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());
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


    // Update the current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);


return (

    <Card style={{ backgroundColor: Colors.white, width: '100%', padding: 16, alignItems:'center' }}>
    
        <View>

            <Text style={[styles.regularText, {textAlign: 'center', }]}>
                {isClockedIn ? "You're Clocked In!" : "You're Not Checked In Yet."}
            </Text>

            <Text style={styles.timeText}>{currentTime}</Text>

            <TouchableOpacity
                style={[styles.button, { marginTop: 10 }]}
                onPress={handlePress}
            >
                <Text style={styles.buttonText}>{isClockedIn ? 'Clock Out' : 'Clock In'}</Text>
            </TouchableOpacity>

        </View>

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
      backgroundColor: Colors.darkBrown,
      paddingVertical: 10,
      paddingHorizontal: 20, 
      width: '100%',
      alignItems: 'center',
      borderRadius: 5,
      minWidth: 180,
  },
  buttonText: {
      color: Colors.white,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  regularText: {
      color: 'black',
      fontSize: 15,
      marginBottom: 5,
  },
});

export default ClockInWidget;