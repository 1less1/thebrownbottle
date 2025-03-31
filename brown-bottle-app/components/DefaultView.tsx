import React, { ReactElement, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors'; 


interface DefaultViewProps {
  children: React.ReactNode;
}


const DefaultView: React.FC<DefaultViewProps> = ({ children }) => {

  return (

    <SafeAreaProvider>

        <SafeAreaView style={styles.safeArea}>

            {children}

        </SafeAreaView>   

    </SafeAreaProvider> 

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default DefaultView;
