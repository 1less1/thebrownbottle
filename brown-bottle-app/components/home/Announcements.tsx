import React from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from '@/components/AltCard';
import DefaultScrollView from '@/components/DefaultScrollView';
import RoleDropdown from '@/components/RoleDropdown';

import { getAllAnnouncements, getUserAnnouncements, getAnnouncementsByRole } from '@/utils/api/announcement';
import { Announcement } from '@/types/api';

const Announcements = () => {

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);

      try {
        const data =
          selectedRoleId == 1
            ? await getAllAnnouncements()
            : await getAnnouncementsByRole(selectedRoleId);

        const sortedData = (data as Announcement[]).sort(
          (a, b) => b.announcement_id - a.announcement_id
        );

        setAnnouncements(sortedData);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [selectedRoleId]); 

  return (
    <Card style={styles.container}>
      
      <View style={styles.scrollContainer}>
        
        <View style={styles.ddContainer}>
          <RoleDropdown
            selectedRoleId={selectedRoleId}
            onRoleSelect={setSelectedRoleId}
          />
        </View>

        <DefaultScrollView>

          {loading ? (
            <Text style={styles.altText}>Loading announcements...</Text>
          
          ) : (
            
            announcements.map((announcement) => (
              
              <AltCard
                key={announcement.announcement_id}
                style={styles.announcementContainer}>

                <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>{announcement.title}</Text>
                  <AltCard style={styles.roleContainer}>
                    <Text style={styles.roleText}>{announcement.role_name}</Text>
                  </AltCard>
                </View>
                <Text style={styles.text}>{announcement.description}</Text>
                <Text style={styles.text}>- {announcement.author}</Text>
                <Text style={styles.dateText}>
                  Date: {announcement.date}{"\n"}
                  Time: {announcement.time}
                </Text>

              </AltCard>

            ))
          )}

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
    maxHeight: 400,
    width: '100%',
    flexDirection: 'column',
  },  
  ddContainer: {
    marginBottom: 5
  },
  announcementContainer: {
    width: '100%',
    backgroundColor: Colors.lightTan,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 6,
  },
  roleContainer: {
    backgroundColor: Colors.darkTan,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 0
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: 'bold'
  },
  text: {
    color: Colors.black,
    fontSize: 14,
  },
  altText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.gray,
  },
  dateText: {
    color: Colors.gray,
    fontSize: 14,
    marginVertical: 4
  }
});

export default Announcements;
