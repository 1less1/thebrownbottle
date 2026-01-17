import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import { CheckboxOption } from '@/types/iCheckbox';

interface HorizontalCheckboxListProps<T extends string | number> {
  data: CheckboxOption<T>[];
  selectedData: CheckboxOption<T>[];
  onSelect: (keys: string[], values: T[]) => void;
  labelText?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const HorizontalCheckboxList = <T extends string | number>({
  data,
  selectedData,
  onSelect,
  labelText,
  disabled = false,
  containerStyle,
}: HorizontalCheckboxListProps<T>) => {
  // Sync internal state with props (ModularCheckbox pattern)
  const [selected, setSelected] = useState<CheckboxOption<T>[]>(selectedData);

  useEffect(() => {
    setSelected(selectedData);
  }, [selectedData]);

  const toggleSelection = (item: CheckboxOption<T>) => {
    const isSelected = selected.some((o) => o.value === item.value);

    const updated = isSelected
      ? selected.filter((o) => o.value !== item.value)
      : [...selected, item];

    setSelected(updated);

    // Extract keys and values for the callback
    const confirmedValues = updated.map((o) => o.value);
    const confirmedKeys = updated.map((o) => o.key);
    onSelect(confirmedKeys, confirmedValues);
  };

  const ListEmpty = (
    <View style={styles.singleOptionRow}>
      <Text style={GlobalStyles.text}>No data found!</Text>
    </View>
  );

  return (
    <View style={[styles.container, containerStyle, disabled && { opacity: 0.5 }]}>
      {labelText ? <Text style={styles.label}>{labelText}</Text> : null}

      {data.length === 0 ? (
        <View style={styles.singleOptionRow}>
          <Text style={GlobalStyles.errorText}>Failed to fetch!</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value?.toString() ?? item.key}
          renderItem={({ item }) => {
            const isSelected = selected.some((o) => o.value === item.value);
            return (
              <Pressable
                onPress={() => toggleSelection(item)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <Ionicons
                  name={isSelected ? "checkbox-outline" : "square-outline"}
                  size={20}
                  color={isSelected ? Colors.blue : Colors.gray}
                />
                <Text style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText // Matches Modular's bolding
                ]}>
                  {item.key}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={ListEmpty}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white, // Default background
  },
  optionSelected: {
    backgroundColor: Colors.selectedBoxBG,
    borderColor: Colors.selectedBox,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.black,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: Colors.blue,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.black,
  },
  singleOptionRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default HorizontalCheckboxList;