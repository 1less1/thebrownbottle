import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type HorizontalCheckboxListProps = {
  labelText: string;
  optionMap: { [displayText: string]: string }; // Mon: 'Monday', Tue: 'Tuesday', etc.
  selectedValues?: string[]; // Values like 'Monday'
  onChange?: (selected: string[]) => void;
};

const HorizontalCheckboxList: React.FC<HorizontalCheckboxListProps> = ({
  labelText,
  optionMap,
  selectedValues = [],
  onChange,
}) => {
  const displayOptions = Object.keys(optionMap); // ['Mon', 'Tue', ...]
  const valueToDisplay = (val: string) =>
    displayOptions.find((key) => optionMap[key] === val) || val;

  const [selected, setSelected] = useState<string[]>(
    selectedValues.map(valueToDisplay)
  );

  useEffect(() => {
    setSelected(selectedValues.map(valueToDisplay));
  }, [selectedValues]);

  const toggleSelection = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];

    setSelected(updated);
    const mapped = updated.map((display) => optionMap[display] || display);
    onChange?.(mapped);
  };

  return (
    <View>
      <Text style={styles.label}>{labelText}</Text>
      <FlatList
        data={displayOptions}
        horizontal
        keyExtractor={(item) => item}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item);
          return (
            <Pressable
              onPress={() => toggleSelection(item)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
            >
              <Ionicons
                name={isSelected ? 'checkbox' : 'square-outline'}
                size={24}
                color={
                  isSelected
                    ? Colors.selectedBox
                    : Colors.unselectedBox
                }
              />
              <Text style={styles.optionText}>{item}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  optionSelected: {
    backgroundColor: Colors.selectedBoxBG,
    borderColor: Colors.selectedBox,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  label: {
    fontSize: 16,
  },
});

export default HorizontalCheckboxList;
