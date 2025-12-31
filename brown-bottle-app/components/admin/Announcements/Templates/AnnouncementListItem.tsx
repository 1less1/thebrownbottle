import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import Badge from '@/components/modular/Badge';
import ExpandableText from '@/components/modular/ExpandableText';

import { Announcement } from '@/types/iAnnouncement';
import { formatDateTime } from '@/utils/dateTimeHelpers';

interface Props {
    announcement: Announcement;
    handleDelete: (announcement_id: number) => void;
    handleViewAcks: () => void;
    loading: boolean;
}

const AnnouncementListItem: React.FC<Props> = ({ announcement, handleDelete, handleViewAcks, loading }) => {

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
                <>
                    {/* Description */}
                    <ExpandableText text={announcement.description} />

                    {/* Author */}
                    <Text style={GlobalStyles.semiBoldSmallAltText}>- {announcement.author}</Text>

                    <View style={{ marginTop: 2 }}>
                        <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                            Posted on {formatDateTime(announcement.timestamp)}
                        </Text>
                    </View>

                    <View style={styles.buttonRow}>
                        {/* Ack Button */}
                        <TouchableOpacity
                            style={[styles.ackButton]}
                            onPress={handleViewAcks}
                            disabled={loading}
                        >
                            <Ionicons name="eye" size={20} color={Colors.blue} />
                        </TouchableOpacity>

                        {/* Delete Button */}
                        <TouchableOpacity
                            style={[GlobalStyles.deleteButton, styles.deleteButton]}
                            onPress={() => handleDelete(announcement.announcement_id)}
                            disabled={loading}
                        >
                            <Ionicons name="close-circle-outline" size={20} color={Colors.red} />
                        </TouchableOpacity>

                    </View>
                </>

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

    // Buttons
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",   // pushes both buttons to the right
        alignItems: "center",
        gap: 10,
    },
    deleteButton: {
        flexShrink: 1,
        borderColor: Colors.borderRed,
        borderWidth: 1,
    },
    ackButton: {
        flexShrink: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: Colors.bgBlue,
        borderColor: Colors.borderBlue,
        borderWidth: 1,
    },
});

export default AnnouncementListItem;