import React from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from '@/components/AltCard';
import DefaultScrollView from '@/components/DefaultScrollView';

import { getAllAnnouncements, getUserAnnouncements } from '@/utils/api/announcement';


interface Announcement {
  announcement_id: number;
  author_id: number;
  author: string;
  title: string;
  description: string;
  date: string; // MM/DD/YYYY format
  time: string; // HH:MM format
}

const Announcements= () => {

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    })();
  }, []);

  return (
    <Card style={styles.container}>
      <View style={styles.scrollContainer}>
      <DefaultScrollView>
      
      {announcements.map((announcement) => (
        <AltCard key={announcement.announcement_id} style={styles.announcement}>
          <Text style={styles.headerText}>{announcement.title}</Text>
          <Text style={styles.text}>{announcement.description}</Text>
          <Text style={styles.text}>- {announcement.author}</Text>
          <Text style={styles.dateText}>
            Date: {announcement.date} and Time: {announcement.time}
          </Text>
        </AltCard>
      ))}
      
      </DefaultScrollView>
      </View>
      
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
  scrollContainer: {
    height: 300, // Set the height to display only three AltCards (adjust as needed)
    width: '100%',
    flexDirection: 'column', // Stack cards vertically
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
  headerText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: Colors.black,
    fontSize: 14,
  },
  dateText: {
    color: Colors.gray,
    fontSize: 14,
  }
});

export default Announcements;
