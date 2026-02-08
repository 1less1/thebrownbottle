import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';

import LoadingCircle from '@/components/modular/LoadingCircle';
import ModularButton from '@/components/modular/ModularButton';

import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext';
import { getEmployee } from '@/routes/employee';

import { signInAndFetchEmployee } from '@/auth/authService';
import type { Employee } from '@/types/iEmployee';

// EmployeeSessionFields:
// Keeps the mapping stable by only depending on the fields we actually store in session.
type EmployeeSessionFields = Pick<
  Employee,
  | 'employee_id'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone_number'
  | 'wage'
  | 'admin'
  | 'primary_role'
  | 'secondary_role'
  | 'tertiary_role'
  | 'is_active'
>;

/**
 * toSessionUser():
 * Converts an employee payload 
 * into the exact shape we store in SessionContext.
 */
const toSessionUser = (currentUser: EmployeeSessionFields) => {
  return {
    employee_id: currentUser.employee_id,
    first_name: currentUser.first_name.toString(),
    last_name: currentUser.last_name.toString(),
    email: currentUser.email.toString(),
    phone_number: currentUser.phone_number.toString(),
    wage: currentUser.wage.toString(),
    admin: Number(currentUser.admin),
    primary_role: Number(currentUser.primary_role),
    secondary_role: Number(currentUser.secondary_role),
    tertiary_role: Number(currentUser.tertiary_role),
    is_active: Number(currentUser.is_active),
  };
};

const HandleLogin = () => {
  const router = useRouter();
  const { user, setUser } = useSession();

  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Auto-skip login if session exists (force close / reopen)
  useEffect(() => {
    if (user?.employee_id) {
      router.replace({ pathname: '/(tabs)/home' });
    }
  }, [user?.employee_id, router]);

  // handleLogin():
  // - Legacy Employee ID login flow
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

      // getEmployee() returns an array; we only use the first record
      const currentUser = response[0] as unknown as EmployeeSessionFields;

      // setUser(): Store session user in one consistent place
      await setUser(toSessionUser(currentUser));

      router.push({ pathname: '/(tabs)/home' });
    } catch (err) {
      console.error('Login Failed:', err);
      setErrorText('Server error.\nPlease try again later!');
    } finally {
      setLoading(false);
    }
  };

  // handleGoogleLogin():
  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setErrorText('');

    try {
      // signInAndFetchEmployee(): backend-validated employee
      const currentUser = (await signInAndFetchEmployee()) as Employee;

      // setUser(): Store session user in one consistent place
      await setUser(toSessionUser(currentUser));

      router.replace({ pathname: '/(tabs)/home' });
    } catch (err: any) {
      if (err?.code === 'SIGN_IN_CANCELLED') {
        setErrorText('Sign-in cancelled.');
        return;
      }

      const status = err?.status;

      if (status === 403) {
        setErrorText('This Google account is not authorized.');
        return;
      }
      if (status === 401) {
        setErrorText('Authentication failed. Please try again.');
        return;
      }

      console.error('Google sign-in failed:', err);
      setErrorText('Google sign-in failed.');
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
        <Text style={[GlobalStyles.errorText, { textAlign: 'center', marginBottom: 10 }]}>
          {errorText}
        </Text>
      )}

      {loading ? (
        <LoadingCircle size={'large'} />
      ) : (
        <>
          <ModularButton text="Login" onPress={handleLogin} />
          <View style={{ height: 10 }} />
          <ModularButton text="Sign in with Google" onPress={handleGoogleLogin} />
        </>
      )}
    </View>
  );
};

export default HandleLogin;

const styles = StyleSheet.create({});
