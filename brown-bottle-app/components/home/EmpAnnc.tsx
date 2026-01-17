import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';

import ModularListView from "@/components/modular/ModularListView";
import AnncListItem from '@/components/admin/Announcements/Templates/AnncListItem';
import AnncSkeleton from '@/components/ui/skeleton/home/AnncSkeleton';

import { getAnnouncement, getAcknowledgedAnnouncements, acknowledgeAnnouncement } from '@/routes/announcement';
import { Announcement, GetAnnouncement } from '@/types/iAnnouncement';

import { useSession } from "@/utils/SessionContext";

interface Props {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const EmpAnnc: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const isMobile = WIDTH < 768;
  const listHeight = isMobile ? HEIGHT * 0.5 : HEIGHT * 0.6;

  const { user } = useSession();

  const [loading, setLoading] = useState(true); // Used for deliberate user fetches
  const [refreshing, setRefreshing] = useState(false); // Used for background fetches
  const [error, setError] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  const [roleFilter, setRoleFilter] = useState<number | null>(null);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const fetchAnnouncements = useCallback(async (isInitial = false) => {
    setError(null);

    if (isInitial) {
      setLoading(true);
      await delay(500);
    } else {
      setRefreshing(true);
    }

    try {
      const params: Partial<GetAnnouncement> = {
        role_id: roleFilter as number
      };
      const data = await getAnnouncement(params);
      setAnnouncements(data);

      // Fetch acknowledgements once user is present
      if (user?.employee_id) {
        const ack = await getAcknowledgedAnnouncements({ employee_id: user.employee_id });
        setAcknowledged(ack.map(a => a.announcement_id));
      }

    } catch (error: any) {
      setError('Failed to fetch announcements.');
      console.log('Failed to fetch announcements', error.message);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, [roleFilter, user?.employee_id]);

  // Fetch announcements on initialization and state update
  useEffect(() => {
    fetchAnnouncements(true); // Initial Load

    const interval = setInterval(() => {
      fetchAnnouncements(false); // SILENT Polling
    }, 20000); // Every 20 seconds

    return () => clearInterval(interval);
  }, [parentRefresh, fetchAnnouncements]);


  const handleAcknowledge = async (announcementId: number) => {
    if (!user) return;
    // This already updates local state correctly
    setAcknowledged((prev) => [...prev, announcementId]);

    try {
      await acknowledgeAnnouncement(announcementId, user.employee_id);
    } catch (error: any) {
      console.log("Error acknowledging announcement:" + error.message);
    }
  };

  const actionButton = (announcement: Announcement, isAcknowledged: boolean) => {
    return (
      <View style={styles.buttonRow}>
        {isAcknowledged ? (
          <Text style={[GlobalStyles.semiBoldText, styles.acknowledged]}>Acknowledged</Text>
        ) : (
          <TouchableOpacity
            onPress={() => handleAcknowledge(announcement.announcement_id)}
            style={styles.ackButton}
          >
            <Text style={[GlobalStyles.semiBoldText, { color: "white" }]}>Acknowledge</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAnnouncement = (announcement: Announcement) => {
    //  use local `acknowledged` state so UI updates immediately
    const isAcknowledged = acknowledged.includes(announcement.announcement_id);

    return (
      <AnncListItem announcement={announcement}>
        {actionButton(announcement, isAcknowledged)}
      </AnncListItem>
    );
  };

  return (

    <View style={styles.container}>

      <View style={styles.scrollContainer}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications" size={20} color="black" style={styles.icon} />
            <Text style={GlobalStyles.floatingHeaderText}>Announcements</Text>
          </View>

          <View style={{ width: '40%' }}>
            <RoleDropdown
              selectedRole={roleFilter}
              onRoleSelect={(value) => setRoleFilter(value as number)}
              labelText=""
              usePlaceholder={true}
              placeholderText="All Roles"
            />
          </View>

        </View>

        {/* Announcement Feed */}
        <View style={{ height: listHeight }}>
          {loading ? (
            <AnncSkeleton />
          ) : (
            <ModularListView
              data={announcements}
              loading={false} // Render skeleton instead!
              error={error}
              emptyText="No announcements available."
              listHeight={375}
              renderItem={renderAnnouncement}
              keyExtractor={(item) => item.announcement_id}
              refreshing={loading}
            />
          )}
        </View>

      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  // Content
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  scrollContainer: {
    maxHeight: 400,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",   // pushes both buttons to the right
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  ackButton: {
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
  },
  icon: {
    marginRight: 3,
  }
});

export default EmpAnnc;
