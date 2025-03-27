import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; // Universal SafeAreaView
import { Colors } from '@/constants/Colors'; // Assuming you have Colors set up


// Define the type of props the DefaultView will receive
interface DefaultViewProps {
  children: React.ReactNode;
  style?: object;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const DefaultView: React.FC<DefaultViewProps> = ({
  children,
  style,
  refreshing = false,
  onRefresh,
}) => {
  return (
    <>

    <SafeAreaView edges={["top"]} style={{ flex: 0, backgroundColor: Colors.brown }} />

      <View style={{ flex: 1, backgroundColor: Colors.brown }}>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={false} // iOS, dictates bounce effect (this causes the weird "overscrolling")
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16} // Smooth scrolling performance
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
        
          <View style={styles.defaultContainer}>{children}</View>

        </ScrollView>

      </View>

    <SafeAreaView edges={["bottom"]} style={{ flex: 0, backgroundColor: Colors.brown }} />
    
    </>

  );
};

// I need to add a gradient for the view holding a scroll view 

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.greyWhite,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyWhite, // Main content background
    width: '100%',
  },
});

export default DefaultView;
