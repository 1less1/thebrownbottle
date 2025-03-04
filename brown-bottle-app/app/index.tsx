import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFDEAB',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  buttonText: {
      color: 'black', 
      fontSize: 16, 
      fontWeight: 'bold'
  }
});

export default function LandingScreen() {
  const router = useRouter();

  const isAdmin = true;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.greyWhite, // Greyish White Background
      }}>

    <View
      style={{
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: Colors.darkTan, // Dark Tan Box
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5, 
        elevation: 5, 
      }}>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            color: 'black',
            fontWeight: 'bold'
          }}>
          Welcome to Brown Bottle App!
        </Text>

      </View>

      
      { /* Normal Employee Login */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/(tabs)/home', params: {isAdmin: 'false'} })}>
          <Text style={styles.buttonText}>Employee Login</Text>
        </TouchableOpacity>
      </View>
      
      { /* Admin Login */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/(tabs)/home', params: {isAdmin: 'true'} })}>
          <Text style={styles.buttonText}>Admin Login</Text>
        </TouchableOpacity>
      </View>

    </View>




  );
  
}
