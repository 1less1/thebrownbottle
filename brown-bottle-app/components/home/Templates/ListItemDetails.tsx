import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import Badge from '@/components/modular/Badge';
import { Announcement } from '@/types/iAnnouncement';
import ExpandableText from '@/components/modular/ExpandableText';
import { formatDateTime } from '@/utils/dateTimeHelpers';

interface Props {
  announcement: Announcement;
  isAcknowledged: boolean;
  handleAcknowledge: (announcement_id: number) => void;
}

const ListItemDetails: React.FC<Props> = ({ announcement, isAcknowledged, handleAcknowledge }) => {

  return (

    <View style={styles.badgeView}>

      <View style={{ flex: 1 }}>

        {/* Top Section + Badge */}
        <View style={styles.topRow}>
          <View style={styles.topLeftText}>
            {/* Announcement Title */}
            <Text style={GlobalStyles.headerText}>{announcement.title}</Text>
          </View>

          <View style={styles.badgeWrapper}>
            <Badge text={announcement.role_name} />
          </View>
        </View>

        {/* Bottom Section (Free Flowing Text) */}
        <View>
          {/* Description */}
          <ExpandableText text={announcement.description} />

          {/* Author */}
          <Text style={GlobalStyles.semiBoldSmallAltText}>- {announcement.author}</Text>

          <View style={{ marginTop: 2 }}>
            <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
              Posted on {formatDateTime(announcement.timestamp)}
            </Text>
          </View>

          {/* Acknowledge Button */}
          {isAcknowledged ? (
            <View style={styles.acknowledgedContainer}>
              <Text style={styles.acknowledgedText}>Acknowledged</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleAcknowledge(announcement.announcement_id)}
              style={styles.ackBtn}
            >
              <Text style={styles.ackBtnText}>Acknowledge</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  badgeView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2
  },
  topLeftText: {
    flex: 1,
    paddingRight: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badgeWrapper: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  expandText: {
    marginTop: 4,
    color: Colors.buttonBlue,
    fontWeight: '600',
    fontSize: 13,
  },
  ackBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    backgroundColor: Colors.buttonBlue,
    borderRadius: 6,
  },
  acknowledgedContainer: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    backgroundColor: Colors.badgeGray,
    borderRadius: 6,
  },
  acknowledgedText: {
    fontWeight: '500',
  },
  ackBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default ListItemDetails;