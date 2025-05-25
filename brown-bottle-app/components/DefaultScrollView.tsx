import React, { ReactElement, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; // Universal SafeAreaView
import { Colors } from '@/constants/Colors'; // Assuming you have Colors set up


// Define the type of props the DefaultView will receive

interface DefaultScrollViewProps {
  children: React.ReactNode;
  style?: object;
  refreshing?: boolean;
  onRefresh?: () => void; // Optional: if not provided, no refresh control is shown
  topSafeAreaColor?: string;
  bottomSafeAreaColor?: string;
  scrollViewColor?: string;
}


const DefaultScrollView: React.FC<DefaultScrollViewProps> = ({ children, style, onRefresh, refreshing = false }) => {
  
  return (

    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      bounces={true}
      overScrollMode="always"
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brown}
            progressViewOffset={200}
          />
        ) : undefined
      }
    >

      <View style={styles.childrenContainer}>{children}</View>

    </ScrollView>

  );
};``

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  childrenContainer: {
    // Removed flexGrow: 1
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});

export default DefaultScrollView;
