import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { Task } from '@/types/iTask';
import { formatDateTime, formatDate } from '@/utils/dateTimeHelpers';

interface Props {
    task: Task;
    children?: React.ReactNode
}

// Reusable Employee Task Modal Content
const TaskModalContent: React.FC<Props> = ({ task, children }) => {

    return (

        <>
            {/* Modal Title */}
            <Text style={GlobalStyles.modalTitle}>
                Task
            </Text>

            {/* Task Details */}

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldText}>Title: </Text>
                <Text style={GlobalStyles.text}>
                    {task.title}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldText}>Description: </Text>
                <Text style={GlobalStyles.text}>
                    {task.description}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldText}>Section: </Text>
                <Text style={GlobalStyles.text}>
                    {task.section_name}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldText}>Due: </Text>
                <Text style={[GlobalStyles.semiBoldText, { color: Colors.orange }]}>
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

            {/* Optional Modal Content - Mainly used for buttons! */}
            {children}
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