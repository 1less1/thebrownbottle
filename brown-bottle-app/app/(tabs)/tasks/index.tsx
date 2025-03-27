import { View, Text, StatusBar, StyleSheet, TouchableOpacity,} from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import TaskList from '@/components/tasks/features/TaskList';
import Active from '@/components/tasks/Active';
import Upcoming from '@/components/tasks/Upcoming';
import Completed from '@/components/tasks/Completed';


// import TaskList from '@/components/tasks/TaskList';

const styles = StyleSheet.create ({
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    marginLeft: 20,
    marginTop: 40,
    marginBottom:20,
    
  },

});

export default function Tasks() {
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
