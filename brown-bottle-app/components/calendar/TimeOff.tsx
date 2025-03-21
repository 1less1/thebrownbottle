import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from "@/components/Card"
import CalendarWidget from '@/components/calendar/CalendarWidget';

const TimeOff = () => {

    return (
        <Card style={styles.container}>
            
            <Text style={{ textAlign: 'center', fontSize:15, fontStyle: 'italic', color: Colors.gray }}>
                No time off requests yet...
            </Text>

        </Card>


    );

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
      },
});


export default TimeOff;