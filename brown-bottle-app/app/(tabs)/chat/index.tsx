import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const Chat = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Chat Page</ThemedText>
      <ThemedText style={styles.text}>This is a chat page</ThemedText>
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

export default Chat;