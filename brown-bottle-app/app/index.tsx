import { TouchableOpacity, Text, View } from 'react-native';
import { useRouter } from 'expo-router';


export default function LandingScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBF7F7', // Light Background
      }}>

    <View
      style={{
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#ECE1D4', // Light brown background
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

      

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FFDEAB',
            borderRadius: 5,
            shadowColor: 'black',
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5, 
            elevation: 5, 
            paddingVertical: 10,
            paddingHorizontal: 10,
            alignItems: 'center',
          }}
          onPress={() => router.push('/(tabs)/home')} // should direct to the home screen
        >
          <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Enter App</Text>
        </TouchableOpacity>
      </View>

    </View>

  );
  
}
