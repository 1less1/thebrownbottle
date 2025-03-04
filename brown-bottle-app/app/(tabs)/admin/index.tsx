import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const Admin = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Admin Page</ThemedText>
      <ThemedText style={styles.text}>Make sure Admin route is protected so that users can't manually open it</ThemedText>
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

export default Admin;