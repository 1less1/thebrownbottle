import React, { useState} from "react";
import { StyleSheet, View } from "react-native";
import ModularDropdown from "@/components/modular/ModularDropdown";
import { Colors } from "@/constants/Colors";

interface TimeOffFilterProps {
  /** The current filter selection */
  selectedFilter: "All" | "Pending" | "Completed";
  /** Called when the user changes the filter */
  onChange: (filter: "All" | "Pending" | "Completed") => void;
}

/**
 * TimeOffFilter — a reusable filter dropdown for the CalendarTimeOff page.
 * Uses the shared ModularDropdown component for consistent UI styling.
 */
const TimeOffFilter: React.FC<TimeOffFilterProps> = ({
  selectedFilter,
  onChange,
}) => {
  // Define dropdown options
  const options = [
    { key: "All", value: "All" },
    { key: "Pending", value: "Pending" },
    { key: "Completed", value: "Completed" },
  ];

  return (
    <View style={styles.container}>
      <ModularDropdown
        labelText=""
        selectedValue={selectedFilter}
        onSelect={(value, key) => onChange(key as "All" | "Pending" | "Completed")}
        options={options}
        placeholderText="Select Status"
        containerStyle={styles.dropdownContainer}
        buttonStyle={styles.dropdownButton}
      />
    </View>
  );
};

export default TimeOffFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownContainer: {
    flex: 0,
  },
  dropdownButton: {
    minWidth: 130,
    maxWidth: 160,
    alignSelf: "flex-start",
  },
});
