import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import SkeletonPulse from '../SkeletonPulse'

const StatSkeletons = () => {
  return (
    <View style={styles.container}>

      {/* 1st Skeleton Card */}
      <View style={[styles.card, styles.blueCard]}>
        <View>
          <SkeletonPulse width={150} height={16} backgroundColor={"#a1c3e68a"} borderRadius={4} />
          <SkeletonPulse width={60} height={44} backgroundColor={"#a1c3e68a"} borderRadius={6} style={{ marginTop: 10 }} />
        </View>

        <SkeletonPulse width={45} height={45} backgroundColor={"#a1c3e68a"} borderRadius={10} />
      </View>

      {/* 2nd Skeleton Card */}
      <View style={[styles.card, styles.yellowCard]}>
        <View>
          <SkeletonPulse width={150} height={16} borderRadius={4} backgroundColor={"#fcba5883"} />
          <SkeletonPulse width={60} height={44} borderRadius={6} backgroundColor={"#fcba5883"} style={{ marginTop: 10 }} />
        </View>

        <SkeletonPulse width={45} height={45} backgroundColor={"#fcc36e83"} borderRadius={10} />
      </View>


      {/* 3rd Skeleton Card */}
      <View style={[styles.card, styles.purpleCard]}>
        <View>
          <SkeletonPulse width={150} height={16} backgroundColor={"#cab1ccb7"} borderRadius={4} />
          <SkeletonPulse width={60} height={44} backgroundColor={"#cab1ccb7"} borderRadius={6} style={{ marginTop: 10 }} />
        </View>

        <SkeletonPulse width={45} height={45} backgroundColor={"#cab1ccb7"} borderRadius={10} />
      </View>

    </View>
  )
}

export default StatSkeletons
const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: '96%',
    alignSelf:'center'
  },
  card: {
    flex: 1, 
    padding: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    flexBasis: '32%'
  },
  yellowCard: {
    backgroundColor: Colors.bgYellow,
    borderColor: Colors.borderYellow
  },
  blueCard: {
    backgroundColor: Colors.bgBlue,
    borderColor: Colors.borderBlue
  },
  purpleCard: {
    backgroundColor: Colors.bgPurple,
    borderColor: Colors.borderPurple
  }
});