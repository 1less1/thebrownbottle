import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { Task } from '@/types/iTask';
import { formatDateTime, formatDate } from '@/utils/dateTimeHelpers';

interface Props {
    task: Task;
}

// Reusable Employee Task Modal Content
const TaskModalContent: React.FC<Props> = ({ task }) => {

    return (

        <>
            {/* Modal Title */}
            <Text style={GlobalStyles.modalTitle}>
                Task
            </Text>

            {/* Task Details */}
            <View style={styles.row}>
                <Text style={GlobalStyles.mediumText}>
                    <Text style={GlobalStyles.semiBoldMediumText}>Title: </Text>
                    {task.title}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.mediumText}>
                    <Text style={GlobalStyles.semiBoldMediumText}>Description: </Text>
                    {task.description}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.mediumText}>
                    <Text style={GlobalStyles.semiBoldMediumText}>Section: </Text>
                    {task.section_name}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={[GlobalStyles.semiBoldMediumText, { color: Colors.orange }]}>
                    {/* Black text overrides orange text here...*/}
                    <Text style={GlobalStyles.semiBoldMediumText}>Due: </Text>
                    {formatDate(task.due_date)}
                </Text>
            </View>

            {/* Last Modified + Timestamp */}
            <View style={{ flexDirection: "column", marginTop: 2 }}>
                {(task.last_modified_name && task.last_modified_at) && (
                    <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                        Modified {formatDateTime(task.last_modified_at)} by {task.last_modified_name}
                    </Text>
                )}
                <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                    Posted {formatDateTime(task.timestamp)} by {task.author}
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

export default TaskModalContent;