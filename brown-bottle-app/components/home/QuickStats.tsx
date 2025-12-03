import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Card from '../modular/Card'

const QuickStats = () => {
  return (
    <View style = {styles.container}>

        <Card>
            <Text>Hello</Text>
        </Card>

        
    </View>
  )
}

export default QuickStats

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap'
    }
})