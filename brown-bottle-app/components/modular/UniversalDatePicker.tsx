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

  /* // Web date input
  if (Platform.OS === 'web') {
    return (
      <input
        type="date"
        dateObject={selectedDate}
        onChange={(e) => {
          const [year, month, day] = e.target.dateObject.split('-').map(Number);
          const newDate = new Date(year, month - 1, day);
          setSelectedDate(formatDate(newDate));
          onChange(formatDate(newDate));
        }}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          fontSize: 16,
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    );
  }
  */

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
          textSectionTitleColor: Colors.darkBrown,
          selectedDayBackgroundColor: Colors.blue,
          selectedDayTextColor: 'white',
          todayTextColor: Colors.blue,
          dayTextColor: 'black',
          arrowColor: Colors.darkBrown,
          monthTextColor: Colors.darkBrown,
          todayDotColor: Colors.blue,
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '400',
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
