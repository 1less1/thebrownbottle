import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Card from "@/components/Card";
import { Colors } from '../constants/Colors'; 

const AnnouncementsCard = () => {
  const announcements = [
    { id: 1, text: 'The work schedules for the month of May have been poste. -Brad' },
    { id: 2, text: 'There is a bartender shift on 4/27 needing to be covered!!!' },
    { id: 3, text: 'Remember to bring your IDs to work next week so we can calibarate you in our system -Tim' },
  ];

  return (
    <Card style={styles.container}>
      {announcements.map((announcement, index) => (
        <Card key={announcement.id} style={[styles.announcement, index !== 0 && { marginTop: 6 }]}>
          <Text style={styles.text}>{announcement.text}</Text>
        </Card>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkTan,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  announcement: {
    backgroundColor: Colors.lightTan,
    width: '90%',
    padding: 10,
  },
  text: {
    color: 'black',
  },
});

export default AnnouncementsCard;
