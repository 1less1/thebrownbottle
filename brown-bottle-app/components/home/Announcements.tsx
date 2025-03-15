import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from '@/components/AltCard';

const Announcements= () => {
  const announcements = [
    { id: 1, text: 'The work schedules for the month of May have been posted. -Brad' },
    { id: 2, text: 'There is a bartender shift on 4/27 needing to be covered!!!' },
    { id: 3, text: 'Remember to bring your IDs to work next week so we can calibarate you in our system -Tim' },
  ];

  return (
    <Card style={styles.container}>
      {announcements.map((announcement, index) => (
        <AltCard key={announcement.id} style={[styles.announcement, index !== 0 && { marginTop: 6 }]}>
          <Text style={styles.text}>{announcement.text}</Text>
        </AltCard>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  announcement: {
    backgroundColor: Colors.lightTan,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: Colors.black,
    fontSize: 16,
  },
});

export default Announcements;
