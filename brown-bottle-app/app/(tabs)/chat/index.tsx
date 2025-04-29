import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';

// API Stuff
import { getShifts, getTables } from '@/utils/api/shift';

export default function Chat() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  // API Stuff
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    getShifts().then(setShifts).catch(console.error);
  }, []);

  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    getTables().then(setTables).catch(console.error);
  }, []);

  return (

    <DefaultView backgroundColor={Colors.white}>


      <View style={{ flex: 1, backgroundColor: Colors.greyWhite }}>


        { /* Chat Header */ }
        <View style={{ width: '100%', paddingTop: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderColor }}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10 }}>
            Chat
          </Text>
        </View>
        
        {/* Temporary Content */}
        <DefaultScrollView>

          {/* Temporary Content 
          <Text>This will be the most GOAT chat of all time!</Text>
          */}

          <View>
            {shifts.map((shift, index) => (
              <Text key={index}>{shift.shift_id}</Text>
            ))}
          </View>

          <View>
            {tables.map((table, index) => (
              <Text key={index}>{table.Tables_in_thebrownbottle}</Text>
            ))}
          </View>

          
        </DefaultScrollView>


      </View>


    </DefaultView>

  )
};
