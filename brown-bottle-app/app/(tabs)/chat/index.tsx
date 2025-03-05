import React from 'react';
import { Text, StyleSheet } from 'react-native';
import DefaultView from '@/components/DefaultView';

const Chat = () => {
  return (
    <DefaultView style={styles.container}>
      <Text style={styles.text}>Chat Page</Text>
      <Text style={styles.text}>This is a chat page</Text>
    </DefaultView>
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


