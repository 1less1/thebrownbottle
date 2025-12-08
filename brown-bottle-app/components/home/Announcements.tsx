import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from "@/components/modular/Card";
import AltCard from '@/components/modular/AltCard';
import DefaultScrollView from '@/components/DefaultScrollView';
import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';

import ModularButton from '@/components/modular/ModularButton';
import ModularModal from '@/components/modular/ModularModal';
import LoadingCard from '@/components/modular/LoadingCard';

import ModularListView from "@/components/modular/ModularListView";
import Badge from '@/components/modular/Badge';
import { getAllAnnouncements, getAnnouncementsByRole, acknowledgeAnnouncement } from '@/routes/announcement';
import { Announcement } from '@/types/iAnnouncement';
import { Ionicons } from '@expo/vector-icons';

import { useSession } from "@/utils/SessionContext";
import { getAcknowledgedAnnouncements } from '@/routes/announcement';

const Announcements = () => {

  // All announcements for listview
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Store selected role (null = All)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // Local list of announcement IDs the user acknowledged
  const [acknowledged, setAcknowledged] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useSession();

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
  // Fetch announcements when role filter changes
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Fetch acknowledged announcements ONLY once user is present
  useEffect(() => {
    const loadAcknowledged = async () => {
      if (!user) return;
      const ack = await getAcknowledgedAnnouncements(user.employee_id);
      setAcknowledged(ack.map(a => a.announcement_id));
    };
    loadAcknowledged();
  }, [user]);


  /**
   * Handle "Acknowledge" click — backend + optimistic UI
   */
  const handleAcknowledge = async (announcementId: number) => {
    if (!user) return;
    // This already updates local state correctly
    setAcknowledged((prev) => [...prev, announcementId]);

    try {
      console.log("Sending ack:", announcementId, user?.employee_id);
      await acknowledgeAnnouncement(announcementId, user.employee_id);
    } catch (err) {
      console.log("Error acknowledging announcement:", err);
    }
  };

  /**
   * Render each announcement row for ModularListView
   */
  const renderAnnouncement = (announcement: Announcement) => {
    //  use local `acknowledged` state so UI updates immediately
    const isAcknowledged = acknowledged.includes(announcement.announcement_id);

    return (
      <View style={styles.announcementContainer}>
        <View style={styles.headerContainer}>
          <Text style={GlobalStyles.headerText}>{announcement.title}</Text>

          <View style={styles.badgeWrapper}>
            <Badge text={announcement.role_name} />
          </View>
        </View>

        <Text style={GlobalStyles.text}>{announcement.description}</Text>
        <Text style={GlobalStyles.semiBoldSmallAltText}>- {announcement.author}</Text>

        {/* Acknowledge Button */}
        {isAcknowledged ? (
          <Text style={styles.acknowledged}>Acknowledged</Text>
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
              selectedRole={selectedRoleId}
              onRoleSelect={(value) => setSelectedRoleId(value as number)}
              labelText=""
              usePlaceholder={true}
              placeholderText="All Roles"
            />
          </View>

        </View>

        {/* ModularListView */}
        <View style={{ height: 375 }}>
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
    marginRight: 10

  },
  badgeWrapper: {
    flexShrink: 0,
    alignItems: "flex-end",
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
    backgroundColor: Colors.buttonBlue,
    borderRadius: 6,
  },
  acknowledged: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    backgroundColor: Colors.ackknowledgedBG,
    borderRadius: 6,
    fontWeight: "500"
  },
  ackBtnText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 3,
  }
});

export default Announcements;
