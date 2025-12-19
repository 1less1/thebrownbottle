import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useEffect, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultView from '@/components/DefaultView';
import { ScrollView } from 'react-native';
import EmpTasks from '@/components/tasks/EmpTasks';

export default function TaskPage() {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (

    <DefaultView backgroundColor={Colors.white}>

      <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>

        {/* Tasks Header */}
        <View style={GlobalStyles.pageHeaderContainer}>
          <Text style={GlobalStyles.pageHeader}>Tasks</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <EmpTasks/>
        </ScrollView>

      </View>

    </DefaultView>

  );
}


const styles = StyleSheet.create({

});