import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  FlatList, TouchableWithoutFeedback, StyleProp,
  ViewStyle, TextStyle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";


export interface DropdownOption {
  key: string;
  value: number | string | null;
}

interface ModularDropdownProps {
  selectedValue: number | string | null;
  onSelect: (value: number | string | null, key: string) => void;
  labelText?: string;
  usePlaceholder?: boolean;
  placeholder?: string;
  placeholderValue?: number | string | null;
  editable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  options: DropdownOption[]; // List of (key, value) pairs
}

const ModularDropdown: React.FC<ModularDropdownProps> = ({
  selectedValue,
  onSelect,
  labelText = "Filter:",
  usePlaceholder = true,
  placeholder = "Select an option...",
  placeholderValue = null,
  editable = true,
  containerStyle,
  buttonStyle,
  options,
}) => {

  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);
  const selectedLabel = selectedOption ? selectedOption.key : "";

  const handleSelect = (option: DropdownOption) => {
    onSelect(option.value, option.key);
    setVisible(false);
  };

  const dropdownOptions = usePlaceholder
    ? [{ key: placeholder, value: placeholderValue }, ...options]
    : options;

  return (
    <View style={[styles.container, containerStyle]}>

      {/* Filter Label */}
      {labelText ? <Text style={styles.label}>{labelText}</Text> : null}

      {/* Dropdown Button */}
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => setVisible(true)}
        disabled={!editable}
      >
        <View style={styles.buttonContent}>
          <Text
            style={[
              styles.optionText,
              { color: selectedLabel ? Colors.black : Colors.gray, marginRight: 5 },
            ]}
          >
            {selectedLabel || placeholder}
          </Text>
          <Ionicons
            name={visible ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.black}
          />
        </View>
      </TouchableOpacity>

      {/* Modal dropdown */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>

            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>

                {/* "Dropdown" Option List */}
                <FlatList
                  style={{ flexGrow: 0 }}
                  data={dropdownOptions}
                  keyExtractor={(item) => item.value !== null ? item.value.toString() : 'null'}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          item.value === selectedValue && styles.selectedOption,
                          item.value === placeholderValue &&
                          item.value !== selectedValue && { color: Colors.gray },
                        ]}
                      >
                        {item.key}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.black,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    alignSelf: "center",
    minWidth: "55%",
    maxWidth: "80%",
    maxHeight: "65%",
    backgroundColor: Colors.white,
    elevation: 5,
    borderRadius: 10,
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 14,
    color: Colors.black,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedOption: {
    fontWeight: "bold",
    color: Colors.blue,
  },
});

export default ModularDropdown;
