import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from "@/components/modular/Card";
import AltCard from '@/components/modular/AltCard';
import RoleDropdown from '@/components/modular/RoleDropdown';
import ModularListView from "@/components/modular/ModularListView";
import { getAllAnnouncements, getAnnouncementsByRole } from '@/routes/announcement';
import { Announcement } from '@/types/iAnnouncement';
import { Ionicons } from '@expo/vector-icons';
import { upperCase } from 'lodash';

const Announcements = () => {

  // All announcements for listview
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Store selected role (null = All)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // Local list of announcement IDs the user acknowledged
  const [acknowledged, setAcknowledged] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch announcements filtered by role
   * If selectedRoleId === null -> Get ALL
   */
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        selectedRoleId === null
          ? await getAllAnnouncements()
          : await getAnnouncementsByRole(selectedRoleId);

      const sorted = (data as Announcement[]).sort(
        (a, b) => b.announcement_id - a.announcement_id
      );

      setAnnouncements(sorted);

    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  }, [selectedRoleId]);

  // Trigger fetch anytime the filter changes
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  /**
   * Handle "Acknowledge" button click
   * For now – ONLY console log
   * Later – send API request to backend + store DB record
   */
  const handleAcknowledge = (announcementId: number) => {
    console.log("Acknowledged announcement:", announcementId);

    // Add ID to acknowledged list so button changes state
    setAcknowledged((prev) => [...prev, announcementId]);
  };

  /**
   * Render each announcement row for ModularListView
   */
  const renderAnnouncement = (announcement: Announcement) => {
    const isAcknowledged = acknowledged.includes(announcement.announcement_id);

    return (
      <View style={styles.announcementContainer}>
        <View style={styles.headerContainer}>
          <Text style={GlobalStyles.headerText}>{announcement.title}</Text>

          <View style={styles.roleContainer}>
            <Text style={[GlobalStyles.awaitingApproval, styles.roleName]}>{announcement.role_name}</Text>
          </View>
        </View>

        <Text style={GlobalStyles.text}>{announcement.description}</Text>
        <Text style={GlobalStyles.text}>- {announcement.author}</Text>

        {/* <Text style={[GlobalStyles.altText, { marginVertical: 5 }]}>
          Date: {announcement.date}{"\n"}
          Time: {announcement.time}
        </Text> */}

        {/* Acknowledge Button */}
        {isAcknowledged ? (
          <Text style={{ color: "green", marginTop: 6 }}>Acknowledged ✔</Text>
        ) : (
          <TouchableOpacity
            onPress={() => handleAcknowledge(announcement.announcement_id)}
            style={styles.ackBtn}
          >
            <Text style={styles.ackBtnText}>Acknowledge</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications" size={22} color="black" style={styles.icon} />
            <Text style={GlobalStyles.floatingHeaderText}>Announcements</Text>
          </View>

          <View style={{ width: '40%' }}>
            <RoleDropdown
              selectedRoleId={selectedRoleId}
              onSelect={(value) => setSelectedRoleId(value === null ? null : value)}
              labelText=""
              placeholder="All Roles"
            />
          </View>

        </View>


        {/* ModularListView for list rendering, loading, error, refresh */}
        <View>
          <ModularListView
            data={announcements}
            loading={loading}
            error={error}
            emptyText="No announcements available."
            maxHeight={375}
            renderItem={renderAnnouncement}
            keyExtractor={(item) => item.announcement_id.toString()}
            onRefresh={fetchAnnouncements}
            refreshing={loading}
            itemContainerStyle={styles.itemContainer}
          />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: "#f5f4f4ce",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
  },
  scrollContainer: {
    maxHeight: 375,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  announcementContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 5,
    marginBottom: 5,
  },
  roleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 3
  },
  roleName: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: 8
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  ackBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    backgroundColor: "#3478f6",
    borderRadius: 6,
  },
  ackBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  icon: {
    marginRight: 3,
  }
});

export default Announcements;
