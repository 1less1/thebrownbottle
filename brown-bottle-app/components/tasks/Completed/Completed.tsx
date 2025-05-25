import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultScrollView from '@/components/DefaultScrollView';
import CompletedTasks from '@/components/tasks/Completed/CompletedTasks';

import { User } from '@/utils/SessionContext'; 
import { Task } from '@/types/api';
import { getTasks } from '@/utils/api/task';

interface CompletedProps {
  user: User;
}

const Completed: React.FC<CompletedProps> = ({ user }) => {

    return (

        <DefaultScrollView>
            
            <View style={{marginVertical: 20, width: "100%"}}>
                <CompletedTasks user={user} />
            </View>

        </DefaultScrollView>

    )
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 10,
        
      },
});

export default Completed;