import React from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import { ScheduleShift, ScheduleDay } from "@/types/iSchedule";

interface ShiftCellProps {
  day: ScheduleDay;
  width: number;
  height: number;
  onPress: (shift: ScheduleShift | null) => void;
}

const ShiftCell: React.FC<ShiftCellProps> = ({ day, width, height, onPress }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const { shift, availability, time_off_approved } = day;

  const isAvailable = availability?.is_available === 1;
  const hasTimeOff = time_off_approved === 1;

  // 1. Approved time off overrides everything
  if (hasTimeOff) {
    return (
      <View style={[styles.shiftCell, { width, height, backgroundColor: Colors.lightGray }]}>
        <Text style={styles.timeOffText}>Time Off</Text>
      </View>
    );
  }


  // 2. Shift exists + is_available=1 (true) --> white background + shift details
  // Shift exists + is_available=0 (false) --> red warning background + shift details
  if (shift) {
    return (
      <Pressable
        onPress={() => onPress(shift)}
        style={({ hovered }) => [
          styles.shiftCell,
          { width, height },
          // Apply red background if unavailable
          !isAvailable && { backgroundColor: Colors.bgRed },
          // Apply the correct hover style based on availability
          hovered && (isAvailable ? styles.shiftCellHovered : styles.warningShiftCellHovered),
        ]}
      >
        <View style={styles.shiftContent}>
          <Text style={GlobalStyles.semiBoldSmallText}>{shift.start_time}</Text>
          <Text style={styles.shiftSection}>{shift.section_name}</Text>
        </View>
      </Pressable>
    );
  }


  // 3. No shift + is_available=0 (false) --> light gray background (clickable)
  if (!isAvailable) {
    return (
      <Pressable
        onPress={() => onPress(null)}
        style={({ hovered }) => [
          styles.shiftCell,
          { width, height, backgroundColor: Colors.lightGray },
          hovered && styles.shiftCellHovered,
        ]}
      >
        <Text style={styles.noShift}>-</Text>
      </Pressable>
    );
  }


  // 4. Default State: No shift exists + is_available=1 (true) --> white background + "-"
  const isHint = availability?.start_time !== null;
  return (
    <Pressable
      onPress={() => onPress(null)}
      style={({ hovered }) => [
        styles.shiftCell,
        { width, height },
        hovered && styles.shiftCellHovered,
      ]}
    >
      {isHint ? (
        <View style={styles.hintWrapper}>
          <Text style={styles.noShift}>-</Text>
          <View style={[styles.hintContainer, { bottom: isMobile ? -15 : -10 }]}>
            <Text style={styles.startTime}>{availability.start_time}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noShift}>-</Text>
      )}
    </Pressable>
  );


};

const styles = StyleSheet.create({
  shiftCell: {
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: Colors.lightGray,
    padding: 4,
    backgroundColor: "white", // Default background
  },
  shiftCellHovered: {
    backgroundColor: Colors.lightGray,
    opacity: 0.6,
  },
  warningShiftCellHovered: {
    backgroundColor: Colors.bgRed,
    opacity: 0.6,
  },
  shiftContent: {
    alignItems: "center",
  },
  shiftSection: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  noShift: {
    color: Colors.darkGray,
    fontSize: 14,
    textAlign: "center",
  },
  timeOffText: {
    color: Colors.darkGray,
    fontSize: 12,
    fontWeight: "600",
  },
  hintWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  hintContainer: {
    position: "absolute",
    right: 2,
  },
  startTime: {
    color: "black",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default ShiftCell;