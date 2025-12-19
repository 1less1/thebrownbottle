import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "@/constants/Colors";
import CalendarModal from "@/components/calendar/CalendarModal";
import { useSession } from "@/utils/SessionContext";
import { Dimensions } from "react-native";
import { getShift } from "@/routes/shift";

import { Shift } from "@/types/iShift";

interface CalendarWidgetProps {
  mode?: "calendar" | "picker";
  pickerType?: PickerType;
  requireShiftSelection?: boolean;
  showShifts?: boolean;
  onSelectDate?: (payload: { date: string; shift: Shift | null }) => void;
  onSelectRange?: (payload: { startDate: string; endDate: string }) => void;
  initialDate?: string;
  onLoadingChange?: (loading: boolean) => void;
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
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  mode = "calendar",
  pickerType = "single",
  requireShiftSelection = false,
  showShifts = true,
  onSelectDate,
  onSelectRange,
  initialDate,
  onLoadingChange,
}) => {
  const { user } = useSession();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  const today = getToday();
  const [selectedDate, setSelectedDate] = useState(initialDate || today);

  const screenWidth = Dimensions.get("window").width;
  const scale = Math.min(screenWidth / 380, 1.1);


  // Fetch Shifts
  useEffect(() => {
    if (!showShifts || !user?.employee_id) return;

    onLoadingChange?.(true);
    (async () => {
      try {
        const data = await getShift({ employee_id: user.employee_id });
        setShifts(data || []);
      } finally {
        onLoadingChange?.(false);
      }
    })();
  }, [showShifts, user?.employee_id]);


  // Mark dates on calendar
  const markedDates = useMemo(() => {
    // Range mode
    if (mode === "picker" && pickerType === "range" && rangeStart) {
      const range: Record<string, any> = {};
      const start = new Date(rangeStart);
      const end = rangeEnd ? new Date(rangeEnd) : start;

      let current = new Date(start);
      while (current <= end) {
        const date = current.toISOString().split("T")[0];
        range[date] = { color: Colors.purple, textColor: "white" };
        current.setDate(current.getDate() + 1);
      }

      range[rangeStart].startingDay = true;
      range[end.toISOString().split("T")[0]].endingDay = true;
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
    const isShiftDay = shifts.some((s) => s.date === dateString);

    if (mode === "picker" && requireShiftSelection && !isShiftDay) return;

    setSelectedDate(dateString);

    if (mode === "picker" && pickerType === "range") {
      handleRangePress(dateString);
      return;
    }

    if (mode === "picker") {
      const shift = shifts.find((s) => s.date === dateString) || null;
      onSelectDate?.({ date: dateString, shift });
      return;
    }

    setSelectedShift(shifts.find((s) => s.date === dateString) || null);
  };


  // Calendar Theme:
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
      <Calendar
        current={selectedDate}
        markingType={pickerType === "range" ? "period" : undefined}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        minDate={mode === "picker" ? today : undefined}
        theme={calendarTheme}
      />

      {mode === "calendar" && selectedShift && (
        <CalendarModal
          visible
          date={selectedShift.date}
          startTime={selectedShift.start_time}
          role={selectedShift.primary_role_name}
          section={selectedShift.section_name}
          onClose={() => setSelectedShift(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
});

export default CalendarWidget;