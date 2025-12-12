import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import SkeletonPulse from '../SkeletonPulse'


const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 600;

const AccountInfoSkeleton = () => {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="person-outline" size={18} color="grey" style={{ marginBottom: 15, marginRight: 2 }} />
        <Text style={styles.mainText}> Account Information</Text>
      </View>

      {/* INFO SECTION */}
      <View style={styles.infoContainer}>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Full Name</Text>
          <SkeletonPulse height={36} width={'100%'} backgroundColor='#f1f1f1' borderRadius={8} />
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Email</Text>
          <SkeletonPulse height={36} width={'100%'} backgroundColor='#f1f1f1' borderRadius={8} />
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Phone</Text>
          <SkeletonPulse height={36} width={'100%'} backgroundColor='#f1f1f1' borderRadius={8} />
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Primary Role</Text>
          <SkeletonPulse height={36} width={'100%'} backgroundColor='#f1f1f1' borderRadius={8} />
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Member Since</Text>
          <SkeletonPulse height={36} width={'100%'} backgroundColor='#f1f1f1' borderRadius={8} />
        
        </View>

      </View>
    </View>
  )
}

export default AccountInfoSkeleton
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  mainText: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  infoBlock: {
    marginBottom: 15,
    paddingBottom: 5,
  },
  mobileWidth: {
    width: "100%",
  },
  desktopWidth: {
    width: "48%",
  },
  titleText: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 5,
    color: Colors.darkGray,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8
  },
});


