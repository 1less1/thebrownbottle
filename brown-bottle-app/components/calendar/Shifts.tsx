import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from "@/components/Card"
import CalendarWidget from '@/components/calendar/CalendarWidget';

const Shifts = () => {

    return (
        <Card style={{ backgroundColor: Colors.white, width: '85%', padding: 16, alignItems:'center' }}>
            
            <Text style={{ textAlign: 'center', fontSize:15, color: 'black' }}>
                Your Upcoming Shifts
            </Text>

        </Card>


    );

};

export default Shifts;