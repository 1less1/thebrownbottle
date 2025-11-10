import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import CompletedTasks from '@/components/tasks/Completed/CompletedTasks';

import { User } from '@/utils/SessionContext';
import { Section } from '@/types/iSection';

interface CompletedProps {
    user: User;
    sections: Section[]
}

const Completed: React.FC<CompletedProps> = ({ user, sections }) => {

    return (

        <DefaultScrollView>

            <View style={{ marginVertical: 20, width: "100%" }}>
                <CompletedTasks user={user} sections={sections} />
            </View>

        </DefaultScrollView>

    )
};

export default Completed;