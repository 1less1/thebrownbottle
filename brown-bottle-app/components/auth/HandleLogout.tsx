import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSession } from '@/utils/SessionContext'; 



const HandleLogout = () => {
  const { clearSession } = useSession();
  const router = useRouter();

  // Handle logout and navigate to the home screen
  const handleLogout = async () => {
    await clearSession(); // Clear session first
    router.replace('/');  // Navigate to index.tsx (entry point) and clear the stack
  };

  return (
    <TouchableOpacity onPress={handleLogout}> 
      <Ionicons name="log-out" size={30} color="gray" style={{ marginBottom: 8 }} />
    </TouchableOpacity>
  );
};

export default HandleLogout;
