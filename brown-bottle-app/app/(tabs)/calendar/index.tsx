import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const Calendar = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Calendar Page</ThemedText>
      <ThemedText style={styles.text}>nothing here yet</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default Calendar;