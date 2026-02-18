import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import LoadingCircle from "@/components/modular/LoadingCircle";
import CalendarModal from "@/components/calendar/CalendarModal";

import { useSession } from "@/utils/SessionContext";

import { Shift } from "@/types/iShift";
import { getShift } from "@/routes/shift";

interface Props {
  mode?: "calendar" | "picker";
  pickerType?: PickerType;
  requireShiftSelection?: boolean;
  showShifts?: boolean;
  onSelectDate?: (payload: { date: string; shift: Shift | null }) => void;
  onSelectRange?: (payload: { startDate: string; endDate: string }) => void;
  initialDate?: string;
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
LocaleConfig.defaultLocale = "en";

type PickerType = "single" | "range";

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const CalendarWidget: React.FC<Props> = ({
  mode = "calendar",
  pickerType = "single",
  requireShiftSelection = false,
  showShifts = true,
  onSelectDate,
  onSelectRange,
  initialDate,
  parentRefresh,
  onRefreshDone,
}) => {
  const { user } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (shift: Shift) => {
    setSelectedShift(shift);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    // We keep the shift data for a moment so the 
    // closing animation doesn't look empty/broken
    setTimeout(() => setSelectedShift(null), 300);
  };

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  const today = getToday();
  const [selectedDate, setSelectedDate] = useState(initialDate || today);

  const screenWidth = Dimensions.get("window").width;
  const scale = Math.min(screenWidth / 380, 1.1);


  // Fetch Shifts - Modified to handle internal loading
  // Wrap fetch in useCallback for consistency
  const fetchShifts = useCallback(async () => {
    if (!showShifts || !user?.employee_id) {
      setShifts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getShift({ employee_id: user.employee_id });
      setShifts(data || []);
    } catch (error: any) {
      setError("Calendar Widget failed to fetch shifts: " + error.message);
    } finally {
      setLoading(false);
      onRefreshDone?.();
    }
  }, [showShifts, user?.employee_id]);

  // Fetch shifts on mount or when parentRefresh changes
  useEffect(() => {
    fetchShifts();
  }, [fetchShifts, parentRefresh]);


  // Mark dates on calendar
  const markedDates = useMemo(() => {
    // Range mode
    if (mode === "picker" && pickerType === "range" && rangeStart) {
      const range: Record<string, any> = {};

      // Use date strings directly to avoid Timezone/ISO UTC shifts
      const start = new Date(rangeStart + "T00:00:00");
      const end = rangeEnd ? new Date(rangeEnd + "T00:00:00") : start;

      let current = new Date(start);
      while (current <= end) {
        // Formats to YYYY-MM-DD manually to stay in local time
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        range[dateStr] = { color: Colors.purple, textColor: "white" };
        current.setDate(current.getDate() + 1);
      }

      // Safety checks: Only set properties if the keys actually exist in our range object
      if (range[rangeStart]) {
        range[rangeStart].startingDay = true;
      }

      const lastDateStr = rangeEnd || rangeStart;
      if (range[lastDateStr]) {
        range[lastDateStr].endingDay = true;
      }

      return range;
    }


    // Show shifts on "picker" mode
    const map: Record<string, any> = {};
    if (showShifts) {
      shifts.forEach((shift) => {
        const isPast = shift.date < today;
        const isPicker = mode === "picker";

        map[shift.date] = {
          selected: true,
          selectedColor: isPicker && isPast ? Colors.disabledBlue : Colors.borderBlue,
        };
      });
    }

    map[today] = { ...(map[today] || {}), marked: true, dotColor: "white" };
    return map;
  }, [mode, pickerType, rangeStart, rangeEnd, shifts, showShifts, today]);


  // Select date range
  const handleRangePress = (date: string) => {
    // CASE 1 — No range yet
    if (!rangeStart && !rangeEnd) {
      setRangeStart(date);
      setRangeEnd(null);
      onSelectRange?.({ startDate: date, endDate: date });
      return;
    }

    // CASE 2 — Full range already selected → start a new range at this date
    if (rangeStart && rangeEnd) {
      setRangeStart(date);
      setRangeEnd(null); // internal: waiting for end
      onSelectRange?.({ startDate: date, endDate: date });
      return;
    }

    // CASE 3 — Only start selected (rangeStart set, rangeEnd null)

    // If user taps before start → reset to new 1-day range at that date
    if (rangeStart && date < rangeStart) {
      setRangeStart(date);
      setRangeEnd(null);
      onSelectRange?.({ startDate: date, endDate: date });
      return;
    }

    // If user taps the same start date again → keep it as a 1-day range
    if (rangeStart && date === rangeStart) {
      // Could optionally clear or keep as 1-day range;
      // here we keep it as 1-day
      setRangeEnd(null);
      onSelectRange?.({ startDate: date, endDate: date });
      return;
    }

    // Normal range selection: date >= start, set end
    if (rangeStart) {
      setRangeEnd(date);
      onSelectRange?.({ startDate: rangeStart, endDate: date });
    }
  };


  // Select single day
  const handleDayPress = ({ dateString }: { dateString: string }) => {
    // 1. Find the shift once
    const foundShift = shifts.find((s) => s.date === dateString) || null;

    // 2. Early exit for picker mode if shift is required but missing
    if (mode === "picker" && requireShiftSelection && !foundShift) return;

    // 3. Always update the visual selection
    setSelectedDate(dateString);

    // 4. Handle Picker Logic
    if (mode === "picker") {
      if (pickerType === "range") {
        handleRangePress(dateString);
      } else {
        onSelectDate?.({ date: dateString, shift: foundShift });
      }
      return; // Exit early since we are in picker mode
    }

    // 5. Handle Calendar Logic
    if (mode === "calendar" && foundShift) {
      setSelectedShift(foundShift);
      setModalVisible(true);
    }
  };


  // Calendar Theme
  const calendarTheme = useMemo(() => {
    const isRange = pickerType === "range";

    return {
      backgroundColor: Colors.white,
      calendarBackground: Colors.white,
      textSectionTitleColor: "black",

      // 🔵 SINGLE MODE COLORS
      selectedDayBackgroundColor: isRange ? Colors.purple : Colors.blue,
      selectedDayTextColor: "white",

      // 🔵 RANGE MODE COLORS
      // react-native-calendars uses "period" markingType for ranges,
      // so the actual range colors come from markedDates, not theme.
      todayTextColor: isRange ? Colors.purple : Colors.blue,

      dayTextColor: "black",
      arrowColor: isRange ? Colors.purple : Colors.blue,
      monthTextColor: isRange ? Colors.purple : Colors.blue,

      textDayFontWeight: "400",
      textMonthFontWeight: "bold",
      textDayHeaderFontWeight: "500",
      textDayFontSize: 12 * scale,
      textMonthFontSize: 16 * scale,
      textDayHeaderFontSize: 12 * scale,
    } as const;
  }, [pickerType, scale]);


  return (

    <View style={styles.container}>
      {error ? (
        <View style={styles.loadingContainer}>
          <Text style={GlobalStyles.errorText}>{error}</Text>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <LoadingCircle size="small" />
        </View>
      ) : (
        <Calendar
          current={selectedDate}
          markingType={pickerType === "range" ? "period" : undefined}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          minDate={mode === "picker" ? today : undefined}
          theme={calendarTheme}
        />
      )}

      {/* Modal triggered only when CalendarWidget is in "calendar" mode! */}
      {selectedShift && (
        <CalendarModal
          visible={modalVisible}
          shift={selectedShift}
          onClose={closeModal}
        />
      )}

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 300, // Approximate height of a standard calendar
  },
  loadingContainer: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  }
});

export default CalendarWidget;