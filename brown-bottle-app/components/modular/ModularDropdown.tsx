import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";

interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  selectedValue: string | number;
  onSelect: (value: string | number, label: string) => void;
  options: DropdownOption[];
  labelText?: string;
  placeholder?: string;
}

const ModularDropdown: React.FC<DropdownProps> = ({
  selectedValue,
  onSelect,
  options,
  labelText = "Filter:",
  placeholder = "Select an option...",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelText}</Text>

      <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => {
          const selected = options.find((opt) => opt.value === value);
          onSelect(value, selected?.label ?? "");
        }}
        style={styles.picker}
      >
        <Picker.Item label={placeholder} value={-1} color="gray" />
        {options.map((opt) => (
          <Picker.Item
            key={opt.value}
            label={opt.label}
            value={opt.value}
            color="black"
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  label: {
    fontSize: 16,
    marginRight: 5,
  },
  picker: {
    flexGrow: 1,
    padding: 5,
    fontSize: 16,
  },
});

export default ModularDropdown;
