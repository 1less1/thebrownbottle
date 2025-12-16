import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "@/constants/Colors";
import CalendarModal from "@/components/calendar/CalendarModal";
import { useSession } from "@/utils/SessionContext";
import { Dimensions } from "react-native";
import { getShift } from "@/routes/shift";

import { Shift } from "@/types/iShift";

interface Props {
  visible: boolean;
  onClose: () => void;
  requireShiftSelection?: boolean;
  dateString: string; // formatted date string: YYYY-MM-DD
  onChange: (newDate: string) => void;
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

const CalendarWidget: React.FC<{
  mode?: "calendar" | "picker";
  pickerType?: PickerType;
  requireShiftSelection?: boolean;
  showShifts?: boolean;
  onSelectDate?: (payload: { date: string; shift: Shift | null }) => void;
  onSelectRange?: (payload: { startDate: string; endDate: string }) => void;
  initialDate?: string;
  onLoadingChange?: (loading: boolean) => void;
}> = ({
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

    // Range picker state (ONLY used when pickerType === "range")
    const [rangeStart, setRangeStart] = useState<string | null>(null);
    const [rangeEnd, setRangeEnd] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState(
      initialDate || new Date().toISOString().split("T")[0]
    );

    // Returns today's date in local time (YYYY-MM-DD)
    const today = useMemo(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }, []);


    /** ---- FETCH SHIFTS (ONLY IF ALLOWED) ---- */
    useEffect(() => {
      if (!showShifts || !user?.employee_id) return;

      onLoadingChange?.(true);

      (async () => {
        try {
          const data = await getShift({ employee_id: user.employee_id });
          setShifts(data || []);
        } catch (err) {
          console.log("Fetch failed:", err);
        } finally {
          onLoadingChange?.(false);
        }
      })();
    }, [showShifts, user?.employee_id]);

    /** ---- MARKED DATES ---- */
    const markedDates = useMemo(() => {

      // RANGE PICKER (period)
      if (mode === "picker" && pickerType === "range" && rangeStart) {
        const range: Record<string, any> = {};

        // Single-day selection
        if (!rangeEnd) {
          range[rangeStart] = {
            startingDay: true,
            endingDay: true,
            color: Colors.borderBlue,
            textColor: "white",
          };
          return range;
        }

        let current = new Date(rangeStart);
        const end = new Date(rangeEnd);

        while (current <= end) {
          const date = current.toISOString().split("T")[0];
          range[date] = {
            color: Colors.borderBlue,
            textColor: "white",
          };
          current.setDate(current.getDate() + 1);
        }

        range[rangeStart].startingDay = true;
        range[rangeEnd].endingDay = true;

        return range;
      }

      // EXISTING LOGIC (unchanged)
      const map: Record<string, any> = {};

      if (showShifts) {
        shifts.forEach((shift) => {
          const isPast = shift.date < today;
          const isPicker = mode === "picker";

          map[shift.date] = {
            selected: true,
            selectedColor:
              isPicker && isPast ? Colors.disabledBlue : Colors.borderBlue,
          };
        });
      }

      if (!map[today]) map[today] = {};
      map[today].marked = true;
      map[today].dotColor = "white";

      return map;
    }, [mode, pickerType, rangeStart, rangeEnd, shifts, showShifts, today]);

    /** ---- RANGE PRESS HANDLER ---- */
    const handleRangePress = (date: string) => {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
        return;
      }

      if (date < rangeStart) {
        setRangeStart(date);
        setRangeEnd(null);
        return;
      }

      setRangeEnd(date);
      onSelectRange?.({ startDate: rangeStart, endDate: date });
    };

    /** ---- DAY PRESS ---- */
    const handleDayPress = (day: { dateString: string }) => {
      const isShiftDay = shifts.some((s) => s.date === day.dateString);

      if (mode === "picker" && requireShiftSelection && !isShiftDay) return;

      setSelectedDate(day.dateString);

      if (mode === "picker" && pickerType === "range") {
        handleRangePress(day.dateString);
        return;
      }

      if (mode === "picker") {
        const selectedShift = shifts.find(
          (s) => s.date === day.dateString
        );

        onSelectDate?.({
          date: day.dateString,
          shift: selectedShift || null,
        });
        return;
      }

      const match = shifts.find((s) => s.date === day.dateString);
      setSelectedShift(match || null);
    };

    const screenWidth = Dimensions.get("window").width;
    const baseWidth = 380;
    const scale = Math.min(screenWidth / baseWidth, 1.1);

    return (
      <View style={styles.container}>
        <Calendar
          current={selectedDate}
          markingType={pickerType === "range" ? "period" : undefined}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          minDate={mode === "picker" ? today : undefined}
          theme={{
            backgroundColor: Colors.white,
            calendarBackground: Colors.white,
            textSectionTitleColor: "black",
            selectedDayBackgroundColor: Colors.blue,
            selectedDayTextColor: Colors.white,
            todayTextColor: Colors.blue,
            dayTextColor: "black",
            arrowColor: Colors.blue,
            monthTextColor: Colors.blue,
            textDayFontWeight: "400",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 12 * scale,
            textMonthFontSize: 16 * scale,
            textDayHeaderFontSize: 12 * scale,
          }}
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
  container: {
    width: "100%",
  },
});

export default CalendarWidget;
