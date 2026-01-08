import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import Badge from '@/components/modular/Badge';

import { Task } from '@/types/iTask';
import { formatDateTime, formatDate } from '@/utils/dateTimeHelpers';

interface Props {
    task: Task;
    children?: React.ReactNode
}

// Reusable Task List Item
const TaskListItem: React.FC<Props> = ({ task, children }) => {

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
                            {task.title}</Text>
                    </View>

                    {/* No need for badge anymore 
                    {task.recurring_task_id !== null && (
                        <View style={styles.badgeWrapper}>
                            <Badge text={"Recurring"} />
                        </View>
                    )}
                    */}

                </View>

                {/* Bottom Section (Free Flowing Text) */}
                <>
                    {/* Task Details */}
                    <View style={styles.row}>
                        <Text style={GlobalStyles.text}>
                            Due:{" "}
                            <Text style={[GlobalStyles.semiBoldText, { color: Colors.orange }]}>
                                {formatDate(task.due_date).replace(/ /g, '\u00A0')}
                            </Text>
                        </Text>
                    </View>

                    {/* Timestamp */}
                    <View style={[styles.row, { marginTop: 2 }]}>
                        <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                            Posted {formatDateTime(task.timestamp)} by {task.author}
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
        alignItems: "flex-end",
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
});


export default TaskListItem;