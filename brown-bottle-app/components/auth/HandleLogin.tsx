import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import ModularButton from '../modular/ModularButton';
import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext';
import { getUserData } from '@/utils/api/user';
import { GlobalStyles } from '@/constants/GlobalStyles';

const HandleLogin = () => {
  const router = useRouter();
  const { setUser } = useSession();

  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLogin = async () => {
    if (loading) return;

    if (!employeeIdInput.trim()) {
      setErrorText('Please enter your Employee ID.');
      return;
    }

    setLoading(true);
    setErrorText('');

    try {
      const response = await getUserData(Number(employeeIdInput));

      if (!response || response.length === 0) {
        setErrorText('No user found with this Employee ID.');
        return;
      }

      const user = response[0];
      setUser({
        user_id: user.employee_id.toString(),
        first_name: user.first_name.toString(),
        last_name: user.last_name.toString(),
        email: user.email.toString(),
        phone_number: user.phone_number.toString(),
        wage: user.wage.toString(),
        is_admin: Number(user.admin),
        primary_role: Number(user.primary_role),
        secondary_role: Number(user.secondary_role),
        tertiary_role: Number(user.tertiary_role),
      });

      router.push({ pathname: '/(tabs)/home' });

    } catch (err) {
      console.error('Login Failed:', err);
      setErrorText('Server error.\nPlease try again later!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, width: 300 }}>
      <TextInput
        value={employeeIdInput}
        onChangeText={setEmployeeIdInput}
        placeholder="Enter Employee ID"
        keyboardType="numeric"
        style={[GlobalStyles.input, { marginBottom: 10 }]}
        editable={!loading}
      />

      {errorText !== '' && (
        <Text style={[GlobalStyles.errorText, { textAlign: 'center', marginBottom: 10 }]}>{errorText}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkTan} style={{ marginTop: 10 }} />
      ) : (
        <ModularButton
          text="Login"
          onPress={handleLogin}
        />
      )}
    </View>
  );
};

export default HandleLogin;

const styles = StyleSheet.create({
});
