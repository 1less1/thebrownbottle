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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brown} />
          ) : undefined
        }
      >
      
        <View style={styles.childrenContainer}>{children}</View>

      </ScrollView>
      
    </>

  );
};

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
