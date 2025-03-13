import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import Card from "@/components/Card";
import AltCard from "@/components/Card"
import CalendarWidget from '@/components/calendar/CalendarWidget';

const TimeOff = () => {

    return (
        <Card style={{ backgroundColor: Colors.white, width: '85%', padding: 16, alignItems:'center' }}>
            
            <Text style={{ textAlign: 'center', fontSize:15, color: 'black' }}>
                Time Off Requests
            </Text>

        </Card>


    );

};

export default TimeOff;