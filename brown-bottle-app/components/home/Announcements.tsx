import React from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from "@/components/modular/Card";
import AltCard from '@/components/modular/AltCard';
import DefaultScrollView from '@/components/DefaultScrollView';
import RoleDropdown from '@/components/modular/RoleDropdown';

import ModularButton from '@/components/modular/ModularButton';
import ModularModal from '@/components/modular/ModularModal';
import LoadingCard from '@/components/modular/LoadingCard';

import { getAllAnnouncements, getUserAnnouncements, getAnnouncementsByRole } from '@/routes/announcement';
import { Announcement } from '@/types/iAnnouncement';

const Announcements = () => {

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [selectedRoleId, setSelectedRoleId] = useState<number>(-1);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);

      try {
        const data =
          selectedRoleId == -1
            ? await getAllAnnouncements()
            : await getAnnouncementsByRole(selectedRoleId);

        const sortedData = (data as Announcement[]).sort(
          (a, b) => b.announcement_id - a.announcement_id
        );

        setAnnouncements(sortedData);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError(true);
      } finally {
        console.log("Successfully fetched announcements!")
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [selectedRoleId]); // Only trigger the fetch when the role ID changes

  return (

    <Card style={styles.container}>

      <View style={styles.scrollContainer}>

        <RoleDropdown
          selectedRoleId={selectedRoleId}
          onRoleSelect={(value) => handleRoleSelect(value as number)}
          labelText=""
        />

        <DefaultScrollView>

          {loading ? (
            <LoadingCard
              loadingText="Loading announcements..."
              textStyle={GlobalStyles.loadingText}
              containerStyle={{ height: 400 }}
            />

          ) : error ? (
            <LoadingCard
              loadingText="Unable to load announcements!"
              textStyle={GlobalStyles.errorText}
              containerStyle={{ height: 400 }}
            />

          ) : (
            announcements.map((announcement) => (

              <AltCard
                key={announcement.announcement_id}
                style={styles.announcementContainer}>

                <View style={styles.headerContainer}>
                  <Text style={GlobalStyles.headerText}>{announcement.title}</Text>
                  <AltCard style={styles.roleContainer}>
                    <Text style={GlobalStyles.boldText}>{announcement.role_name}</Text>
                  </AltCard>
                </View>
                <Text style={GlobalStyles.text}>{announcement.description}</Text>
                <Text style={GlobalStyles.text}>- {announcement.author}</Text>
                <Text style={[GlobalStyles.altText, { marginVertical: 5 }]}>
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
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  scrollContainer: {
    height: 400,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
});

export default Announcements;
