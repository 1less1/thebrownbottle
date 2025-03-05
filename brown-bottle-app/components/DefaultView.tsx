import React from 'react';
import { View, ScrollView, SafeAreaView, RefreshControl, StyleSheet } from 'react-native';
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
    <SafeAreaView style={[styles.safeArea, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined // Use `undefined` instead of `null`
        }
      >
        <View style={styles.defaultContainer}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.greyWhite, // Set background color to greyWhite by default
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyWhite, // Ensure default background color
    height: '100%', // Full height of the screen
    width: '100%',  // Full width of the screen
  },
});

export default DefaultView;
