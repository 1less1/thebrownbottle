import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { formatDateTime } from '@/utils/dateTimeHelpers';

import StatusBadge from '@/components/modular/StatusBadge';
import { ShiftCoverRequest, Status } from "@/types/iShiftCover";

interface Props {
    request: ShiftCoverRequest;
}

// Reusable Shift Cover List Item Details
const SCRListItem: React.FC<Props> = ({ request }) => {

    return (

        <View style={styles.badgeView}>

            <View style={{ flex: 1 }}>

                {/* Top Section + Badge */}
                <View style={styles.topRow}>
                    <View style={styles.topLeftText}>
                        {/* "Employee is requesting" line */}
                        {request.status !== 'Pending' && request.accepted_first_name && request.accepted_last_name ? (
                            <>
                                <Text style={GlobalStyles.boldText}>
                                    {request.accepted_first_name} {request.accepted_last_name} { }
                                </Text>
                                <Text style={GlobalStyles.text}>
                                    ({request.accepted_primary_role_name}) { }
                                </Text>
                                <Text style={GlobalStyles.altText}>covering...</Text>
                            </>
                        ) : (
                            <Text style={GlobalStyles.semiBoldAltText}>
                                Shift Available
                            </Text>
                        )}
                    </View>

                    <View style={styles.badgeWrapper}>
                        <StatusBadge status={request.status as Status} />
                    </View>
                </View>

                {/* Bottom Section (Free Flowing Text) */}
                <>
                    {/* Shift Details */}
                    <View style={styles.row}>
                        <Text style={GlobalStyles.semiBoldText}>
                            {request.shift_date} {"@"} {request.shift_start}
                        </Text>
                    </View>

                    {/* Original Shift Assignment */}
                    <View style={[styles.row, { marginTop: 2 }]}>
                        <Text style={GlobalStyles.text}>
                            From:{" "}
                            <Text style={[GlobalStyles.boldText, { color: Colors.blue }]}>
                                {request.requested_first_name} {request.requested_last_name} { }
                            </Text>
                            ({request.requested_primary_role_name})
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

export default SCRListItem;