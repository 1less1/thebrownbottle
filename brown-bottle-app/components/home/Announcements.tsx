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
        <AltCard key={announcement.id} style={[styles.announcement,]}>
          <Text style={styles.text}>{announcement.text}</Text>
        </AltCard>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  announcement: {
    width: '100%',
    backgroundColor: Colors.lightTan,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 6,
  
  },
  text: {
    color: Colors.black,
    fontSize: 14,
  },
});

export default Announcements;
