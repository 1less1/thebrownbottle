import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { formatDateTime, formatDate } from '@/utils/dateTimeHelpers';

import Badge from '@/components/modular/Badge';
import { Task } from '@/types/iTask'

interface Props {
    task: Task | null;
}

// Reusable Shift Cover List Item Details
const TaskListItem: React.FC<Props> = ({ task }) => {

    if (!task) return null;

    return (

        <View style={styles.badgeView}>

            <View style={{ flex: 1 }}>

                {/* Top Section + Badge */}
                <View style={styles.topRow}>
                    <View style={styles.topLeftText}>
                        {/* Task Title */}
                        <Text style={GlobalStyles.headerText}>{task.title}</Text>
                    </View>

                    {task.recurring_task_id !== null && (
                        <View style={styles.badgeWrapper}>
                            <Badge text={"Recurring"} />
                        </View>
                    )}

                </View>

                {/* Bottom Section (Free Flowing Text) */}
                <>
                    {/* Task Details */}
                    <View style={styles.row}>
                        <Text style={GlobalStyles.text}>Due: </Text>
                        <Text style={[GlobalStyles.semiBoldText, { color: Colors.orange }]}>{formatDate(task.due_date)}</Text>
                    </View>

                    {/* Timestamp */}
                    <View style={[styles.row, { marginTop: 2 }]}>
                        <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                            Posted on {formatDateTime(task.timestamp)} by {task.author}
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


export default TaskListItem;