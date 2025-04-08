import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from "@/components/Card"
import CalendarWidget from '@/components/calendar/CalendarWidget';

import { ShiftData } from '@/types/shift';

interface Props {
  shifts: ShiftData[];
}

const Calendar: React.FC<Props> = ({ shifts }) => {

    return (
        <Card style={styles.container}>

            <CalendarWidget shifts={shifts} />

        </Card>


    );

};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.white, 
    alignItems: 'center', 
    alignSelf: 'center', 
    padding: 16, 
    margin: 14,
  },
});

export default Calendar;