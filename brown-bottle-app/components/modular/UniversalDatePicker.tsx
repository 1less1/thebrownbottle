import React, { useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

interface Props {
  dateString: string; // date string in 'YYYY-MM-DD'
  onChange: (dateString: string) => void;
}

const UniversalDatePicker: React.FC<Props> = ({ dateString, onChange }) => {
  
  const [selectedDate, setSelectedDate] = useState(dateString);

  // Picker For all 3 Platforms (Web, IOS, Android)
  return (

    <View style={styles.container}>

      <Calendar
        current={selectedDate}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: Colors.blue,
          },
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          onChange(day.dateString);
        }}
        theme={{
          backgroundColor: 'white',
          calendarBackground: 'white',
          textSectionTitleColor: 'black',
          selectedDayBackgroundColor: Colors.blue,
          selectedDayTextColor: 'white',
          todayTextColor: 'black',
          dayTextColor: 'black',
          arrowColor: 'black',
          monthTextColor: 'black',
          todayDotColor: Colors.blue,
          todayBackgroundColor: Colors.lightBorderColor,
          textDayFontWeight: '600',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 13,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
});

export default UniversalDatePicker;
