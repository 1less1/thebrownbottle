import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { formatDateTime, formatDate } from '@/utils/dateTimeHelpers';

import StatusBadge from '@/components/modular/StatusBadge';
import { TimeOffRequest, Status } from "@/types/iTimeOff";

interface Props {
    request: TimeOffRequest | null;
}

// Reusable Time Off List Item Details
const TORListItem: React.FC<Props> = ({ request }) => {

    if (!request) return null;

    return (

        <View style={styles.badgeView}>

            <View style={{ flex: 1 }}>

                {/* Top Section + Badge */}
                <View style={styles.topRow}>
                    <View style={styles.topLeftText}>
                        <Text style={GlobalStyles.semiBoldText}>
                            {request.start_date === request.end_date
                                ? formatDate(request.start_date)
                                : `${formatDate(request.start_date)} → ${formatDate(request.end_date)}`
                            }
                        </Text>
                    </View>

                    <View style={styles.badgeWrapper}>
                        <StatusBadge status={request.status as Status} />
                    </View>
                </View>

                {/* Bottom Section (Free Flowing Text) */}
                <>
                    <View style={styles.row}>
                        <Text style={GlobalStyles.text}>From: </Text>
                        <Text
                            style={[GlobalStyles.boldText, { color: Colors.purple }]}
                        >
                            {request.first_name} {request.last_name} { }
                        </Text>
                        <Text>
                            ({request.primary_role_name})
                        </Text>
                    </View>

                    {/* Timestamp */}
                    <View style={[styles.row, { marginTop: 2 }]}>
                        <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                            Submitted on {formatDateTime(request.timestamp)}
                        </Text>
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
        alignItems: "flex-end",
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
});


export default TORListItem;