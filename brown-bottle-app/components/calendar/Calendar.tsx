import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from "@/components/Card"
import CalendarWidget from '@/components/calendar/CalendarWidget';

const Calendar = () => {

    return (
        <Card style={{ backgroundColor: Colors.white, width: '85%', padding: 16, alignItems:'center', margin: 14}}>

            <CalendarWidget/>

        </Card>


    );

};

export default Calendar;