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
    children?: React.ReactNode
}

const AnncListItem: React.FC<Props> = ({ announcement, children }) => {

    return (

        <View style={styles.badgeView}>

            <View style={{ flex: 1 }}>

                {/* Top Section + Badge */}
                <View style={styles.topRow}>
                    <View style={styles.topLeftText}>
                        {/* Announcement Title */}
                        <Text style={GlobalStyles.headerText}>{announcement.title}</Text>
                    </View>

                    {/* Role Badge */}
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

                    {/* Timestamp */}
                    <View style={{ marginTop: 2 }}>
                        <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                            Posted on {formatDateTime(announcement.timestamp)}
                        </Text>
                    </View>

                    {/* Optional List Item Content - Mainly used for buttons! */}
                    {children}
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
    
    // Content
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
});

export default AnncListItem;