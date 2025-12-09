import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { ShiftCoverRequest } from '@/types/iShiftCover';
import { formatDateTime, formatShiftDate, formatTime } from '@/utils/dateTimeHelpers';

interface Props {
    request: ShiftCoverRequest | null;
}

// Reusable Shift Cover Modal Details
const ModalDetails: React.FC<Props> = ({ request }) => {

    if (!request) return null;

    const isPending = request.status === "Pending";

    return (

        <>
            {/* Modal Title */}
            <Text style={GlobalStyles.modalTitle}>
                Shift Cover Request
            </Text>

            {/* Covering Text */}
            {!isPending ? (
                <View style={styles.row}>
                    <Text style={GlobalStyles.semiBoldMediumText}>
                        {request.accepted_first_name} {request.accepted_last_name} { }
                    </Text>
                    <Text style={GlobalStyles.mediumText}>({request.accepted_primary_role_name}) { }</Text>
                    <Text style={GlobalStyles.mediumAltText}>covering... </Text>
                    <Text style={[GlobalStyles.semiBoldMediumText, { color: Colors.blue }]}>
                        {request.requested_first_name} {request.requested_last_name}{"'s "}
                    </Text>
                    <Text style={GlobalStyles.mediumText}>({request.requested_primary_role_name}) { }</Text>
                    <Text style={GlobalStyles.mediumAltText}>Shift:</Text>
                </View>
            ) : (
                <View style={styles.row}>
                    <Text style={[GlobalStyles.semiBoldMediumText, { color: Colors.blue }]}>
                        {request.requested_first_name} {request.requested_last_name}{"'s "}
                    </Text>
                    <Text style={GlobalStyles.mediumText}>({request.requested_primary_role_name}) { }</Text>
                    <Text style={GlobalStyles.mediumText}>
                        Shift:
                    </Text>
                </View>
            )}

            {/* Shift Details */}
            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Date: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {formatShiftDate(request.shift_date)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Start Time: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {formatTime(request.shift_start)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Section: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {request.section_name}
                </Text>
            </View>

            {/* Timestamp */}
            <View style={[styles.row, { marginTop: 2 }]}>
                <Text style={[GlobalStyles.altText, { color: Colors.gray }]}>
                    Submitted on {formatDateTime(request.timestamp)}
                </Text>
            </View>
        </>

    );

};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: "wrap",
        marginBottom: 10
    },
})

export default ModalDetails;