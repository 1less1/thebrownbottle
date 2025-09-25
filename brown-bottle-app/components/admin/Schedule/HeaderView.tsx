import React from 'react'
import { StyleSheet,View, Text } from 'react-native'
import { Colors } from '@/constants/Colors';

import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';
import ModularButton from '@/components/modular/ModularButton';
import Spreadsheet from './SpreadSheet';

const HeaderView = () => {



  return (

   <View style={styles.container}>
    <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
            <ModularButton text="Dropdown Here" onPress={() => {}} />
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
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 9,
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
