import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

import ModularButton from '../modular/ModularButton';
import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext';
import { getEmployee } from '@/utils/api/employee';
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
      const response = await getEmployee({ employee_id: Number(employeeIdInput) });

      if (!response || response.length === 0) {
        setErrorText('Login Failed');
        return;
      }

      const currentUser = response[0];
      setUser({
        employee_id: currentUser.employee_id.toString(),
        first_name: currentUser.first_name.toString(),
        last_name: currentUser.last_name.toString(),
        email: currentUser.email.toString(),
        phone_number: currentUser.phone_number.toString(),
        wage: currentUser.wage.toString(),
        admin: Number(currentUser.admin),
        primary_role: Number(currentUser.primary_role),
        secondary_role: Number(currentUser.secondary_role),
        tertiary_role: Number(currentUser.tertiary_role),
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
