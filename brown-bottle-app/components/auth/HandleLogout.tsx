import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext';
import { unregisterPushTokenAsync } from '@/utils/notification';
import AnimatedTouchableWrapper from '../modular/AnimatedTouchable';
import { GlobalStyles } from '@/constants/GlobalStyles';

import { logout } from '@/auth/authService';

const HandleLogout = () => {
  const { user, clearSession } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    // Unregister push token first so this device stops receiving notifications.
    if (user?.employee_id) {
      await unregisterPushTokenAsync(Number(user.employee_id));
    }

    try {
      // Sign out of Firebase/Google (auth session)
      await logout();
    } catch (e) {
      console.warn("Firebase logout failed (continuing):", e);
    }

    await clearSession();
    router.replace('/');
  };

  return (
    <AnimatedTouchableWrapper onPress={handleLogout}>
      <View style={[GlobalStyles.tag]}>
        <Ionicons name="log-out-outline" size={30} color="black" style={{ marginTop: 5, marginBottom: 5, marginLeft: 3 }} />
      </View>
    </AnimatedTouchableWrapper>
  );
};

export default HandleLogout;
