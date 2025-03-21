import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from "@/components/Card"
import CalendarWidget from '@/components/calendar/CalendarWidget';

interface EventData {
    visible: boolean,
    isShift: boolean;
    date: string | null;
    shiftTime?: string | null;
    role?: string | null;
    events?: string[] |null;
  }
  
  interface Props {
    events: { [key: string]: EventData };
  }

const Calendar: React.FC<Props> = ({ events }) => {

    return (
        <Card style={styles.container}>

            <CalendarWidget events={events} />

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