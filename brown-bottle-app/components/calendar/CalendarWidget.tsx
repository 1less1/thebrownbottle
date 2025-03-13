import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors'; 

import { Calendar, LocaleConfig } from 'react-native-calendars';

import Card from "@/components/Card";
import AltCard from "@/components/Card"

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ]
};

LocaleConfig.defaultLocale = 'en';


const CalendarWidget = () => {

      return (
        <View style={{width: '100%'}} >

            <Calendar style={{width: '100%'}}
            // Initial date
            current={new Date().toISOString().split('T')[0]}
        
            // Marked dates (optional)
            markedDates={{
                '2025-03-15': { selected: true, marked: true, selectedColor: Colors.darkBrown },
                '2025-03-28': { selected: true, marked: true, selectedColor: Colors.darkBrown },
                '2025-04-28': { selected: true, marked: true, selectedColor: Colors.darkBrown },

            }}
        
            // Styling
            theme={{
                backgroundColor: Colors.white,
                calendarBackground: Colors.white,
                textSectionTitleColor: Colors.darkBrown,
                selectedDayBackgroundColor: Colors.darkBrown,
                selectedDayTextColor: Colors.white,
                todayTextColor: Colors.brown,
                dayTextColor: 'black',
                arrowColor: Colors.darkBrown,
                monthTextColor: Colors.darkBrown,
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '400',
                textDayFontSize: 12,
                textMonthFontSize: 16,
                textDayHeaderFontSize:12,
            }}
        

            />

        </View>
        


    );
};

export default CalendarWidget;