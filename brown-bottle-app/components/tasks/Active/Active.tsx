import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import ActiveTasks from '@/components/tasks/Active/ActiveTasks';

import { User } from '@/utils/SessionContext'; 
import { Section } from '@/types/api';

interface ActiveProps {
  user: User;
  sections: Section[]
}

const Active: React.FC<ActiveProps> = ({ user, sections }) => {

    return (

        <DefaultScrollView>
            
            <View style={{marginVertical: 20, width: "100%"}}>
                <ActiveTasks user={user} sections={sections} />
            </View>

        </DefaultScrollView>

    )
};

export default Active;
