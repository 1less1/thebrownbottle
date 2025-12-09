import React from 'react';
import { View  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext';
import AnimatedTouchableWrapper from '../modular/AnimatedTouchable';
import { GlobalStyles } from '@/constants/GlobalStyles';



const HandleLogout = () => {
  const { clearSession } = useSession();
  const router = useRouter();

  // Handle logout and navigate to the home screen
  const handleLogout = async () => {
    await clearSession(); // Clear session first
    router.replace('/');  // Navigate to index.tsx (entry point) and clear the stack
  };

  return (
    <AnimatedTouchableWrapper onPress={handleLogout}>
        <View style={[GlobalStyles.tag, ]}>
        <Ionicons name="log-out-outline" size={30} color="black" style={{ marginTop: 5, marginBottom: 5, marginLeft: 3}} />
        </View>
    </AnimatedTouchableWrapper>
  );
};

export default HandleLogout;
