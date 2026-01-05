import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { TimeOffRequest } from '@/types/iTimeOff';
import { formatDateTime, formatDate } from '@/utils/dateTimeHelpers';

interface Props {
    request: TimeOffRequest | null;
}

// Reusable Time Off Modal Details
const TORModalContent: React.FC<Props> = ({ request }) => {

    if (!request) return null;

    return (

        <>
            {/* Modal Title */}
            <Text style={GlobalStyles.modalTitle}>
                Time Off Request
            </Text>

            { /* Time Off Details */}
            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Date: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {request.start_date === request.end_date
                        ? formatDate(request.start_date)
                        : `${formatDate(request.start_date)} → ${formatDate(request.end_date)}`
                    }
                </Text>
            </View>


            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Reason: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {request.reason}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>From: </Text>
                <Text style={[GlobalStyles.boldMediumText, { color: Colors.purple }]}>
                    {request.first_name} {request.last_name}
                </Text>
            </View>

            {/* Timestamp */}
            <View style={styles.row}>
                <Text style={[GlobalStyles.altText, { marginTop: 2, color: Colors.gray }]}>
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

export default TORModalContent;