import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from '@/components/AltCard';

import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext';

const LoginScreen = () => {

  const router = useRouter();

  const { setEmployeeId } = useSession(); // Access the setter function for employeeId
  const [employeeIdInput, setEmployeeIdInput] = useState(''); // State for input field

  const handleLogin = () => {
    const employeeId = parseInt(employeeIdInput, 10);
    if (!isNaN(employeeId)) {
      setEmployeeId(employeeId); // Save the employeeId in global session state
      router.push({ pathname: '/(tabs)/home', params: { isAdmin: 'false' } }); // Navigate after login
    } else {
      alert('Please enter a valid Employee ID');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      
      <TextInput
        value={employeeIdInput}
        onChangeText={setEmployeeIdInput}
        placeholder="Enter Employee ID"
        keyboardType="numeric"
        style={styles.userInput}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    backgroundColor: Colors.darkTan, // Dark Tan Button
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: 300,
  },
  buttonText: {
      color: 'black', 
      fontSize: 16, 
      fontWeight: 'bold'
  },
  userInput: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    marginBottom: 20, 
    paddingLeft: 10 
  },
});
