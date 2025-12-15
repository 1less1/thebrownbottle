import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from "@/components/modular/Card";
import AltCard from '@/components/modular/AltCard';
import DefaultScrollView from '@/components/DefaultScrollView';
import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';

import ModularButton from '@/components/modular/ModularButton';
import ModularModal from '@/components/modular/ModularModal';

import ModularListView from "@/components/modular/ModularListView";
import Badge from '@/components/modular/Badge';
import ListItemDetails from '@/components/home/Templates/ListItemDetails';

import { getAnnouncement, acknowledgeAnnouncement } from '@/routes/announcement';
import { Announcement, GetAnnouncement } from '@/types/iAnnouncement';
import { Ionicons } from '@expo/vector-icons';

import { useSession } from "@/utils/SessionContext";
import { getAcknowledgedAnnouncements } from '@/routes/announcement';

interface Props {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const Announcements: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const isMobile = WIDTH < 768;
  const listHeight = isMobile ? height * 0.5 : height * 0.6;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  const [roleFilter, setRoleFilter] = useState<number | null>(null);

  const { user } = useSession();

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Partial<GetAnnouncement> = {
        role_id: roleFilter as number
      };
      const data = await getAnnouncement(params);
      setAnnouncements(data);

    } catch (error) {
      setError('Failed to fetch announcements.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  // Fetch announcements on initialization and state update
  useEffect(() => {
    fetchAnnouncements();
  }, [parentRefresh, fetchAnnouncements]);

  // Fetch acknowledged announcements ONLY once user is present
  useEffect(() => {
    const loadAcknowledged = async () => {
      if (!user) return;
      const ack = await getAcknowledgedAnnouncements(user.employee_id);
      setAcknowledged(ack.map(a => a.announcement_id));
    };
    loadAcknowledged();
  }, [user]);


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

  const renderAnnouncement = (announcement: Announcement) => {
    //  use local `acknowledged` state so UI updates immediately
    const isAcknowledged = acknowledged.includes(announcement.announcement_id);

    return (
      <ListItemDetails announcement={announcement} isAcknowledged={isAcknowledged} handleAcknowledge={handleAcknowledge} />
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
              selectedRole={roleFilter}
              onRoleSelect={(value) => setRoleFilter(value as number)}
              labelText=""
              usePlaceholder={true}
              placeholderText="All Roles"
            />
          </View>

        </View>

        {/* Announcment Feed */}
        <View style={{ height: listHeight }}>
          <ModularListView
            data={announcements}
            loading={loading}
            error={error}
            emptyText="No announcements available."
            listHeight={375}
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
    maxHeight: 400,
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
