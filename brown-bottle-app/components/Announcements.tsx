import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Card from "@/components/Card";
import { Colors } from '../constants/Colors'; 

const AnnouncementsCard = () => {
  const announcements = [
    { id: 1, text: 'thebrownbottle.com is prone to IDOR. #normalizecybercriminals' },
    { id: 2, text: 'Aaryn got his arm slammed in a stove. #bitchmoves' },
    { id: 3, text: 'Who is going to the Banana Bar Crawl? I think Brad is. Get over here boi. #peelsonwheels' },
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
