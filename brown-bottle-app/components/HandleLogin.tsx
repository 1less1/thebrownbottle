import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from '@/components/AltCard';

import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext';

import { getUserData } from '@/utils/api/user';

const HandleLogin = () => {

  const router = useRouter();

  const { user, setUser } = useSession();

  const [employeeIdInput, setEmployeeIdInput] = useState('');

  const handleLogin = async () => {
    if (!employeeIdInput.trim()) {
      Alert.alert('Error', 'Please enter your Employee ID.');
      return;
    }

    try {
      const response = await getUserData(Number(employeeIdInput));

      if (!response || response.length === 0) {
        Alert.alert('Login Failed', 'No user found with this ID.');
        return;
      }
      
      const user = response[0]; 


      // Save to session context
      setUser({
        id: user.employee_id.toString(),
        firstName: user.first_name.toString(),
        lastName: user.last_name.toString(),
        email: user.email.toString(),
        phoneNumber: user.phone_number.toString(),
        wage: user.wage.toString(),
        isAdmin: Number(user.admin),
        
      });

      // Navigate to home/dashboard
      router.push({ pathname: '/(tabs)/home' });

    } catch (err) {
      Alert.alert('Login Failed', 'Invalid Employee ID or server error.');
      console.error(err);
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

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

    </View>

  );

};

export default HandleLogin;

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
