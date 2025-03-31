import React, { ReactElement, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors'; 


interface DefaultViewProps {
  children: React.ReactNode;
  backgroundColor?: string; // Optional Prop -> Default is transparent
}


const DefaultView: React.FC<DefaultViewProps> = ({ children, backgroundColor = 'transparent' }) => {

  return (

    <SafeAreaProvider>

        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>

            {children}

        </SafeAreaView>   

    </SafeAreaProvider> 

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    //backgroundColor: 'transparent',
  },
});

export default DefaultView;
