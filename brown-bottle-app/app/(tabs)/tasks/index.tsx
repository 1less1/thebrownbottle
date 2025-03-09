import { StyleSheet, Image, Platform } from 'react-native';

import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import { View, Text } from 'react-native';

import TaskList from '@/components/tasks/TaskList';

const styles = StyleSheet.create ({

});

export default function Tasks() {
  return (

    <DefaultView>

      {/* Top Strip */}
      <View style={{ backgroundColor: Colors.mediumTan, position: 'absolute', top: 0, height: 55, width: '100%', }} />

      {/* Tasks Header */}
      <View style={{ marginTop: 65, marginBottom: 10, width:'85%' }}>
        <View style={{alignSelf:'flex-start'}}>
          <Text style={{ textAlign: 'left', fontSize: 36, color: 'black', fontWeight: 'bold' }}>
              Your Tasks:
          </Text>
        </View>
      </View>

      {/* Task List */}
      <View style={{ width: '85%'}}>
        <TaskList/>
      </View>
    
    </DefaultView>

  )
};
