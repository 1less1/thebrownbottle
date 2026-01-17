import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import Badge from '@/components/modular/Badge';

import { RecurringTask } from '@/types/iRecurringTask';
import { formatDateTime, formatDate } from '@/utils/dateTimeHelpers';

interface Props {
    recurringTask: RecurringTask;
    children?: React.ReactNode
}

// Reusable Recurring Task List Item
const RecurringTaskistItem: React.FC<Props> = ({ recurringTask, children }) => {

    return (

        <View style={styles.badgeView}>

            <View style={{ flex: 1 }}>

                {/* Top Section + Badge */}
                <View style={styles.topRow}>
                    <View style={styles.topLeftText}>
                        {/* Task Title */}
                        <Text
                            style={GlobalStyles.headerText}
                            numberOfLines={1}           // Limit to one line
                            ellipsizeMode="tail"        // Show ellipses at the end
                        >
                            {recurringTask.title}
                        </Text>
                    </View>

                    {/* Recurring Badge */}
                    <View style={styles.badgeWrapper}>
                        <Badge text={"Recurring"} />
                    </View>
                </View>

                {/* Bottom Section (Free Flowing Text) */}
                <>
                    {/* Task Start Date */}
                    <View style={styles.row}>
                        <Text style={GlobalStyles.text}>
                            Start Date:{" "}
                            <Text style={[GlobalStyles.semiBoldText, { color: Colors.pendingYellow }]}>
                                {formatDate(recurringTask.start_date)}
                            </Text>
                        </Text>
                    </View>

                    {/* Task End Date */}
                    <View style={styles.row}>
                        <Text style={GlobalStyles.text}>
                            End Date:{" "}
                            <Text style={[GlobalStyles.semiBoldText, { color: Colors.pendingYellow }]}>
                                {recurringTask.end_date ? formatDate(recurringTask.end_date) : "No End Date"}
                            </Text>
                        </Text>
                    </View>

                    {/* Timestamp */}
                    <View style={[styles.row, { marginTop: 2 }]}>
                        <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                            Posted on {formatDateTime(recurringTask.timestamp)} by {recurringTask.author}
                        </Text>
                    </View>

                    {/* Optional List Item Content - Mainly used for buttons! */}
                    {children}
                </>

            </View>

        </View >

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
        alignItems: "flex-end",
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
});


export default RecurringTaskistItem;