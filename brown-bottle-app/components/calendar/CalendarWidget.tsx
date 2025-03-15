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

// EventData Object Defined
interface EventData {
  date: string;
  shiftTime?: string;
  events: string[];
}

// React Native Calendars read dates in the format: YYYY-MM-DD
const events: { [key: string]: EventData } = {
  '2025-03-15': {
    date: '2025-03-15',
    shiftTime: '9:00 AM - 5:00 PM',
    events: ['Server'],
  },
  '2025-03-28': {
    date: '2025-03-28',
    shiftTime: '4:00 PM - 8:45 PM',
    events: ['Bartender'],
  },
  '2025-04-28': {
    date: '2025-04-28',
    events: ['New Schedules due'],
  },
};

const CalendarWidget = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const handleDayPress = (day: any) => {
    const event = events[day.dateString as keyof typeof events]; // Type assertion
    if (event) {
      setSelectedEvent(event); // Set the event data for the modal
    }
  };

  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = {
      selected: true,
      selectedColor: Colors.darkBrown, // Matches default selected style
      marked: true,
      // dotColor: Colors.darkBrown, // Optional if you want the dot too
    };
    return acc;
  }, {} as any);


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
          todayTextColor: Colors.brown,
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
      {selectedEvent && (

        <CalendarModal
          visible={!!selectedEvent}
          date={selectedEvent.date}
          shiftTime={selectedEvent.shiftTime}
          events={selectedEvent.events}
          onClose={() => setSelectedEvent(null)}
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
