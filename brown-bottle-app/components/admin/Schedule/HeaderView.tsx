import React from 'react'
import { StyleSheet,View, Text } from 'react-native'
import { Colors } from '@/constants/Colors';

import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';
import ModularButton from '@/components/modular/ModularButton';
import { useState } from 'react';
import ShiftCalendar from './ShiftCalendar';

const HeaderView = () => {

  const [showCalendar, setShowCalendar] = useState(false);

  return (

   <View style={styles.container}>
    <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>

            <ModularButton text="Dropdown Here" 
              onPress={() => setShowCalendar(!showCalendar)}/>
            {showCalendar && (
              <View style={{ marginTop: 20 }}>
                <ShiftCalendar />
              </View>
            )}

          </View>
        <View style={styles.rightSection}>
          <Text style={styles.rightText}>Week of</Text>
          <ModularButton text="Date" onPress={() => {}} />
        </View>
      </View>
    </Card>
   </View>

  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '80%',
  },
  card: {
    
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'flex-start',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rightText: {
    marginRight: 10,
    fontSize: 16, 
},
})
export default HeaderView
