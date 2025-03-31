import React, { ReactElement, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; // Universal SafeAreaView
import { Colors } from '@/constants/Colors'; // Assuming you have Colors set up


// Define the type of props the DefaultView will receive
interface DefaultScrollViewProps {
  children: React.ReactNode;
  style?: object;
  refreshing?: boolean;
  onRefresh?: () => void;
  topSafeAreaColor?: string;
  bottomSafeAreaColor?: string;
  scrollViewColor?: string;
}


const DefaultScrollView: React.FC<DefaultScrollViewProps> = ({
  children,
  style,
  topSafeAreaColor = Colors.greyWhite, // Default Top Color
  bottomSafeAreaColor = Colors.greyWhite, // Default Bottom Color 
  scrollViewColor = Colors.greyWhite, // Default Scroll View Color
}) => {
  const [refreshing, setRefreshing] = useState(false);

  // Handle the refresh action
  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    // Simulate an API call or some other action
    setTimeout(() => {
      setRefreshing(false); // Stop refreshing after 2 seconds (simulate refresh)
    }, 2000);
  };

  return (
    <>

      {/* <SafeAreaView edges={["top"]} style={{ flex: 0, backgroundColor: topSafeAreaColor }} /> */}

      {/* This View Dictates the Color behind the Scroll View */}
      {/* The Scroll View has a "transparent" background color! 
      <View style={{ flex: 1, backgroundColor: scrollViewColor }}> 
      */}    
          
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true} // iOS, dictates bounce effect (this causes the weird "overscrolling")
        overScrollMode="always"
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        //scrollEventThrottle={16} // Smooth scrolling performance
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
      
        <View style={styles.childrenContainer}>{children}</View>

      </ScrollView>

      {/* <SafeAreaView edges={["bottom"]} style={{ flex: 0, backgroundColor: bottomSafeAreaColor }} /> */}
      
    </>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  childrenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Main content background
    width: '100%',
  },
});

export default DefaultScrollView;
