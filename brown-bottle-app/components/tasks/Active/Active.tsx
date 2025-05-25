import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import ActiveTasks from '@/components/tasks/Active/ActiveTasks';

import { User } from '@/utils/SessionContext'; 

interface ActiveProps {
  user: User;
}

const Active: React.FC<ActiveProps> = ({ user }) => {

    return (

        <DefaultScrollView>
            
            <View style={{marginVertical: 20, width: "100%"}}>
                <ActiveTasks user={user} />
            </View>

        </DefaultScrollView>

    )
};

export default Active;
