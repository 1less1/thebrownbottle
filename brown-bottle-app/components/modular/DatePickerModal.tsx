import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import UniversalDatePicker from '@/components/modular/UniversalDatePicker';
import ModularButton from '@/components/modular/ModularButton';
import ModularModal from '@/components/modular/ModularModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  dateString: string; // formatted date string: YYYY-MM-DD
  onChange: (newDate: string) => void;
}

const DatePickerModal: React.FC<Props> = ({ visible, onClose, dateString, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(dateString);

  useEffect(() => {
    setSelectedDate(dateString);
  }, [dateString]);

  const handleDateChange = (formattedDate: string) => {
    // Validate and normalize input date string
    const newDate = dayjs(formattedDate, 'YYYY-MM-DD', true);
    if (newDate.isValid()) {
      const normalizedDateStr = newDate.format('YYYY-MM-DD');
      setSelectedDate(normalizedDateStr);
      onChange(normalizedDateStr);
    } else {
      // If invalid, do nothing or handle error as needed
      console.warn('Invalid date string passed to DatePickerModal:', formattedDate);
    }
  };

  return (

    <ModularModal visible={visible} onClose={onClose}>
      
      <UniversalDatePicker
        dateString={selectedDate}
        onChange={handleDateChange}
      />

      {/* Close Button */}
      <View style={GlobalStyles.buttonRowContainer}>
        <ModularButton
          text="Close"
          style={{ flex: 1 }}
          onPress={onClose} />
      </View>

    </ModularModal>

  );
};

const styles = StyleSheet.create({
});

export default DatePickerModal;
