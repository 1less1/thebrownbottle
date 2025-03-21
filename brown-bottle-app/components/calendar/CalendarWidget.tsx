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

const CalendarWidget: React.FC<Props> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const handleDayPress = (day: any) => {
    const event = events[day.dateString as keyof typeof events];
    if (event) {
      setSelectedEvent(event);
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
          isShift={selectedEvent.isShift}
          date={selectedEvent.date}
          shiftTime={selectedEvent.shiftTime}
          role={selectedEvent.role}
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
