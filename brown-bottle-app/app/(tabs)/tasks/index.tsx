import { View, Text, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import TaskList from '@/components/tasks/TaskList';

export default function Tasks() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: Colors.white }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.borderColor}}>
        <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold', marginLeft: 30, marginBottom:10}}>
                Your Tasks
            </Text>
     </View>
    
    {/* Tasks Header ^^^ */}
    
    <DefaultView>

      {/* Task List */}
      <View style={{ width:'85%', margin: 20 }}>
        <TaskList/>
      </View>

    
    </DefaultView>
    </View>

  )
};
