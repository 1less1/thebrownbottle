import React, { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { format, parse } from 'date-fns';

interface Props {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  onChange: (dateString: string) => void; // formatted like 'YYYY-MM-DD' or 'HH:mm:ss'
}

const formatDate = (date: Date, mode: 'date' | 'time' | 'datetime') => {
  switch (mode) {
    case 'time':
      return format(date, 'HH:mm:ss');
    case 'datetime':
      return format(date, "yyyy-MM-dd'T'HH:mm:ss");
    case 'date':
    default:
      return format(date, 'yyyy-MM-dd');
  }
};

const parseInput = (text: string, mode: 'date' | 'time' | 'datetime'): Date | null => {
  try {
    switch (mode) {
      case 'time':
        return parse(text, 'HH:mm:ss', new Date());
      case 'datetime':
        return parse(text, "yyyy-MM-dd'T'HH:mm:ss", new Date());
      case 'date':
      default:
        return parse(text, 'yyyy-MM-dd', new Date());
    }
  } catch {
    return null;
  }
};

const UniversalDateTimePicker: React.FC<Props> = ({
  value,
  mode = 'date',
  onChange,
}) => {
  const [textValue, setTextValue] = useState(formatDate(value, mode));

  const handleChange = (text: string) => {
    setTextValue(text);
    const parsed = parseInput(text, mode);
    if (parsed && !isNaN(parsed.getTime())) {
      onChange(formatDate(parsed, mode));
    }
  };

  if (Platform.OS === 'web') {
    const inputType = mode === 'time' ? 'time' : 'date';
    return (
      <input
        type={inputType}
        value={textValue}
        onChange={(e) => handleChange(e.target.value)}
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

  // Mobile: use a TextInput styled like web input
  return (
    <View style={{ padding: 10 }}>
      <TextInput
        value={textValue}
        onChangeText={handleChange}
        placeholder={mode === 'time' ? 'HH:mm:ss' : mode === 'datetime' ? "YYYY-MM-DD'T'HH:mm:ss" : 'YYYY-MM-DD'}
        keyboardType={mode === 'time' ? 'numeric' : 'default'}
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
    </View>
  );
};

export default UniversalDateTimePicker;
