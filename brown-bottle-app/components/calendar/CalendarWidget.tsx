import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Colors } from '@/constants/Colors';
import CalendarModal from '@/components/calendar/CalendarModal';

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


import { ShiftData } from '@/types/shift';

interface Props {
  shifts: ShiftData[];
}

const CalendarWidget: React.FC<Props> = ({ shifts }) => {
  const [selectedShift, setSelectedShift] = useState<ShiftData | null>(null);

  const handleDayPress = (day: any) => {
    const shift = shifts.find(shift => shift.date === day.dateString);
    if (shift) {
      setSelectedShift(shift);
    }
  };

  const markedDates = shifts.reduce((acc, shift) => {
    if (shift.date) {
      acc[shift.date] = {
        selected: true,
        selectedColor: Colors.darkBrown,
        marked: true,
      };
    }
    return acc;
  }, {} as Record<string, any>);


  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: Colors.white,
          calendarBackground: Colors.white,
          textSectionTitleColor: Colors.darkBrown,
          selectedDayBackgroundColor: Colors.darkBrown,
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.lightBrown,
          dayTextColor: 'black',
          arrowColor: Colors.darkBrown,
          monthTextColor: Colors.darkBrown,
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '400',
          textDayFontSize: 12,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />

      {/* Show modal if a date is selected */}
      {selectedShift && (

        <CalendarModal
          visible={!!selectedShift}
          date={selectedShift.date}
          startTime={selectedShift.startTime}
          role={selectedShift.role}
          onClose={() => setSelectedShift(null)}
        />

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default CalendarWidget;
